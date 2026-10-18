interface SendChatMessageRequest {
    thread_id: string;
    user_message: string;
}

interface SendChatMessageResponse {
    thread_id: string;
    response: string;
}

export const chatService = {
    async sendMessage(
        token: string,
        data: SendChatMessageRequest
    ): Promise<SendChatMessageResponse> {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
            cache: "no-store",
        });

        const result: unknown = await response.json();

        if (!response.ok) {
            const message =
                typeof result === "object" &&
                result !== null &&
                "message" in result &&
                typeof result.message === "string"
                    ? result.message
                    : "Failed to send chat message.";

            throw new Error(message);
        }

        if (
            typeof result !== "object" ||
            result === null ||
            !("thread_id" in result) ||
            typeof result.thread_id !== "string" ||
            !("response" in result) ||
            typeof result.response !== "string"
        ) {
            throw new Error("Invalid response from chat service.");
        }

        return {
            thread_id: result.thread_id,
            response: result.response,
        };
    },
};