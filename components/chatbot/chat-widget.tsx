"use client";

import {
    useEffect,
    useState,
    type FormEvent,
    type KeyboardEvent,
} from "react";

import {
    chatService,
    ChatServiceError,
} from "@/lib/services/chat-service";

import { useAuthStore } from "@/lib/stores/auth-store-provider";

import {
    ChatWidgetView,
    type ChatMessage,
} from "@/components/chatbot/chat-widget-view";

export function ChatWidget() {
    const token = useAuthStore((state) => state.token);
    const isAuthReady = useAuthStore((state) => state.isAuthReady);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    const [isOpen, setIsOpen] = useState(false);
    const [threadId, setThreadId] = useState("");
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        setThreadId(crypto.randomUUID());
    }, []);

    function toggleChat(): void {
        setIsOpen((current) => !current);
    }

    function handleInputKeyDown(
        event: KeyboardEvent<HTMLTextAreaElement>,
    ): void {
        if (
            event.key === "Enter" &&
            !event.shiftKey &&
            !event.nativeEvent.isComposing
        ) {
            event.preventDefault();
            event.currentTarget.form?.requestSubmit();
        }
    }

    
    async function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> {
        event.preventDefault();

        const userMessage = input.trim();

        if (!userMessage || !threadId || loading) {
            return;
        }

        const assistantMessageId = crypto.randomUUID();

        const requestData = {
            thread_id: threadId,
            user_message: userMessage,
        };

        setMessages((current) => [
            ...current,
            {
                id: crypto.randomUUID(),
                role: "user",
                content: userMessage,
            },
            {
                id: assistantMessageId,
                role: "assistant",
                content: "",
            },
        ]);

        setInput("");
        setLoading(true);
        setErrorMessage("");

        let receivedContent = false;

        // Gunakan callback yang sama untuk request login dan guest.
        function handleToken(tokenChunk: string): void {
            receivedContent = true;

            setMessages((current) =>
                current.map((message) => {
                    if (message.id !== assistantMessageId) {
                        return message;
                    }

                    return {
                        ...message,
                        content: message.content + tokenChunk,
                    };
                }),
            );
        }

        // Hapus placeholder jika belum ada jawaban yang diterima.
        function removeEmptyAssistantMessage(): void {
            if (!receivedContent) {
                setMessages((current) =>
                    current.filter(
                        (message) => message.id !== assistantMessageId,
                    ),
                );
            }
        }

        // Tampilkan pesan ketika fitur membutuhkan autentikasi.
        function showLoginRequiredMessage(): void {
            setMessages((current) =>
                current
                    .filter(
                        (message) => message.id !== assistantMessageId,
                    )
                    .concat({
                        id: crypto.randomUUID(),
                        role: "assistant",
                        content:
                            "Fitur ini membutuhkan akun. Silakan login terlebih dahulu. Kamu tetap bisa bertanya tentang produk tanpa login.",
                    }),
            );

            setErrorMessage("");
        }
        

        try {
            // Percobaan pertama menggunakan sesi yang tersedia.
            await chatService.sendMessageStream(
                token,
                requestData,
                handleToken,
            );

            if (!receivedContent) {
                removeEmptyAssistantMessage();
                setErrorMessage("AI returned an empty response.");
            }
        } catch (error) {
            console.error("Failed to stream chat response:", error);

            const authRequired =
                error instanceof ChatServiceError &&
                error.code === "AUTH_REQUIRED";

            // Jika token lama ditolak, bersihkan sesi dan ulangi sebagai guest.
            if (authRequired && token) {
                clearAuth();

                // Reset placeholder sebelum memulai stream baru.
                receivedContent = false;

                setMessages((current) =>
                    current.map((message) =>
                        message.id === assistantMessageId
                            ? { ...message, content: "" }
                            : message,
                    ),
                );

                try {
                    await chatService.sendMessageStream(
                        null,
                        requestData,
                        handleToken,
                    );

                    if (!receivedContent) {
                        removeEmptyAssistantMessage();
                        setErrorMessage("AI returned an empty response.");
                    } else {
                        setErrorMessage("");
                    }

                    return;
                } catch (guestError) {
                    console.error(
                        "Guest chat request failed:",
                        guestError,
                    );

                    if (
                        guestError instanceof ChatServiceError &&
                        guestError.code === "AUTH_REQUIRED"
                    ) {
                        showLoginRequiredMessage();
                        return;
                    }

                    removeEmptyAssistantMessage();

                    setErrorMessage(
                        guestError instanceof Error
                            ? guestError.message
                            : "Unable to contact the AI service.",
                    );

                    return;
                }
            }

            // Jika guest sendiri meminta fitur yang membutuhkan login.
            if (authRequired) {
                showLoginRequiredMessage();
                return;
            }

            removeEmptyAssistantMessage();

            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Unable to contact the AI service.",
            );
        } finally {
            setLoading(false);
        }
    }


    if (!isAuthReady) {
        return null;
    }

    return (
        <ChatWidgetView
            isOpen={isOpen}
            input={input}
            messages={messages}
            loading={loading}
            errorMessage={errorMessage}
            threadReady={Boolean(threadId)}
            onToggle={toggleChat}
            onInputChange={setInput}
            onSubmit={handleSubmit}
            onInputKeyDown={handleInputKeyDown}
        />
    );
}