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
        event: KeyboardEvent<HTMLTextAreaElement>
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
        event: FormEvent<HTMLFormElement>
    ): Promise<void> {
        event.preventDefault();

        const userMessage = input.trim();

        if (
            !userMessage ||
            !threadId ||
            loading
        ) {
            return;
        }

        setMessages((current) => [
            ...current,
            {
                id: crypto.randomUUID(),
                role: "user",
                content: userMessage,
            },
        ]);

        setInput("");
        setLoading(true);
        setErrorMessage("");

        try {
            const response = await chatService.sendMessage(token, {
                thread_id: threadId,
                user_message: userMessage,
            });

            setMessages((current) => [
                ...current,
                {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: response.response,
                },
            ]);
        } catch (error) {
            console.error("Failed to send chat message:", error);

            if (
                error instanceof ChatServiceError &&
                error.code === "AUTH_REQUIRED"
            ) {
                setMessages((current) => [
                    ...current,
                    {
                        id: crypto.randomUUID(),
                        role: "assistant",
                        content:
                            "Untuk menggunakan fitur ini, silakan login terlebih dahulu. Kamu tetap bisa bertanya tentang produk tanpa login.",
                    },
                ]);

                setErrorMessage("");
                return;
            }

            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Unable to contact the AI service."
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