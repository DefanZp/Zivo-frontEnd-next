interface SendChatMessageRequest {
    thread_id: string;
    user_message: string;
}

interface SendChatMessageResponse {
    thread_id: string;
    response: string;
}

type ChatServiceErrorCode =
    | "AUTH_REQUIRED"
    | "REQUEST_FAILED";

export class ChatServiceError extends Error {
    constructor(
        message: string,
        public readonly code: ChatServiceErrorCode,
        public readonly status?: number,
    ) {
        super(message);
        this.name = "ChatServiceError";
    }
}

function isRecord(
    value: unknown,
): value is Record<string, unknown> {
    return (
        typeof value === "object" &&
        value !== null
    );
}

function getErrorMessage(result: unknown): string {
    if (!isRecord(result)) {
        return "Failed to send chat message.";
    }

    if (
        typeof result.message === "string"
    ) {
        return result.message;
    }

    if (
        typeof result.detail === "string"
    ) {
        return result.detail;
    }

    return "Failed to send chat message.";
}

function isUnauthenticatedMessage(message: string): boolean {
    return /\b(unauthenticated|unauthorized|auth_required|invalid or expired token|expired token|invalid token)\b/i
        .test(message.trim());
}

export const chatService = {
    async sendMessage(
        token: string | null,
        data: SendChatMessageRequest,
    ): Promise<SendChatMessageResponse> {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            Accept: "application/json",
        };

        // Guest tidak mengirim Authorization header.
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch("/api/chat", {
            method: "POST",
            headers,
            body: JSON.stringify(data),
            cache: "no-store",
        });

        const result: unknown = await response
            .json()
            .catch(() => null);

        const errorMessage = getErrorMessage(result);

        const authRequired =
            response.status === 401 ||
            isUnauthenticatedMessage(errorMessage);

        if (!response.ok) {
            throw new ChatServiceError(
                errorMessage,
                authRequired
                    ? "AUTH_REQUIRED"
                    : "REQUEST_FAILED",
                response.status,
            );
        }

        if (
            !isRecord(result) ||
            typeof result.thread_id !== "string" ||
            typeof result.response !== "string"
        ) {
            throw new ChatServiceError(
                "Invalid response from chat service.",
                "REQUEST_FAILED",
            );
        }

        // Menangani service yang mengembalikan
        // "Unauthenticated" melalui HTTP 200.
        if (
            isUnauthenticatedMessage(result.response)
        ) {
            throw new ChatServiceError(
                "Authentication is required.",
                "AUTH_REQUIRED",
            );
        }

        return {
            thread_id: result.thread_id,
            response: result.response,
        };
    },

        async sendMessageStream(
        token: string | null,
        data: SendChatMessageRequest,
        onToken: (content: string) => void,
    ): Promise<void> {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch("/api/chat/stream", {
            method: "POST",
            headers,
            body: JSON.stringify(data),
            cache: "no-store",
        });

        // Tangani HTTP error sebelum membaca stream.
        if (!response.ok) {
            const result: unknown = await response
                .json()
                .catch(() => null);

            const errorMessage = getErrorMessage(result);

            const authRequired =
                response.status === 401 ||
                isUnauthenticatedMessage(errorMessage);

            throw new ChatServiceError(
                errorMessage,
                authRequired
                    ? "AUTH_REQUIRED"
                    : "REQUEST_FAILED",
                response.status,
            );
        }

        if (!response.body) {
            throw new ChatServiceError(
                "Streaming response is not available.",
                "REQUEST_FAILED",
            );
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let buffer = "";
        let completed = false;

        // Memproses satu event SSE yang sudah lengkap.
        function handleEvent(block: string): void {
            let eventName = "message";
            const dataLines: string[] = [];

            for (const line of block.split(/\r?\n/)) {
                if (line.startsWith("event:")) {
                    eventName = line.slice(6).trim();
                } else if (line.startsWith("data:")) {
                    dataLines.push(line.slice(5).trimStart());
                }
            }

            if (dataLines.length === 0) {
                return;
            }

            let eventData: unknown;

            try {
                eventData = JSON.parse(dataLines.join("\n"));
            } catch {
                throw new ChatServiceError(
                    "Invalid streaming event received.",
                    "REQUEST_FAILED",
                );
            }

            if (eventName === "token") {
                if (
                    isRecord(eventData) &&
                    typeof eventData.content === "string"
                ) {
                    onToken(eventData.content);
                }

                return;
            }

            if (eventName === "error") {
                const message = getErrorMessage(eventData);

                throw new ChatServiceError(
                    message,
                    isUnauthenticatedMessage(message)
                        ? "AUTH_REQUIRED"
                        : "REQUEST_FAILED",
                );
            }

            if (eventName === "done") {
                completed = true;
            }
        }

        try {
            while (true) {
                const { value, done } = await reader.read();

                if (done) {
                    buffer += decoder.decode();
                    break;
                }

                buffer += decoder.decode(value, {
                    stream: true,
                });

                // Satu potongan jaringan dapat berisi
                // beberapa event atau hanya sebagian event.
                while (true) {
                    const separator = /\r?\n\r?\n/.exec(buffer);

                    if (
                        !separator ||
                        separator.index === undefined
                    ) {
                        break;
                    }

                    const block = buffer.slice(
                        0,
                        separator.index,
                    );

                    buffer = buffer.slice(
                        separator.index + separator[0].length,
                    );

                    handleEvent(block);
                }
            }

            // Proses event terakhir jika masih tersisa.
            if (buffer.trim()) {
                handleEvent(buffer);
            }

            if (!completed) {
                throw new ChatServiceError(
                    "The AI response stream ended unexpectedly.",
                    "REQUEST_FAILED",
                );
            }
        } finally {
            reader.releaseLock();
        }
    },
};