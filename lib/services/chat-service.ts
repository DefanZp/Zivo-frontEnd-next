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

function isUnauthenticatedMessage(
    message: string,
): boolean {
    return /^(unauthenticated|unauthorized|auth_required)\.?$/i
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
};