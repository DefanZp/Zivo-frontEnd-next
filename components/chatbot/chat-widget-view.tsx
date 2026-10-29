"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
    useEffect,
    useRef,
    type FormEvent,
    type KeyboardEvent,
} from "react";
import {
    Bot,
    MessageCircle,
    Send,
    User,
    X,
} from "lucide-react";

export interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
}

interface ChatWidgetViewProps {
    isOpen: boolean;
    input: string;
    messages: ChatMessage[];
    loading: boolean;
    errorMessage: string;
    threadReady: boolean;
    onToggle: () => void;
    onInputChange: (value: string) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    onInputKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
}

export function ChatWidgetView({
    isOpen,
    input,
    messages,
    loading,
    errorMessage,
    threadReady,
    onToggle,
    onInputChange,
    onSubmit,
    onInputKeyDown,
}: ChatWidgetViewProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages, loading]);

    return (
        <div className="fixed bottom-5 right-5 z-50">
            {isOpen && (
                <section
                    aria-label="Zivo AI shopping assistant"
                    className="mb-4 flex h-[min(600px,calc(100dvh-110px))] w-[min(380px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-2xl"
                >
                    <header className="flex items-center justify-between bg-ink-950 px-4 py-4 text-white">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-full bg-white/10">
                                <Bot size={22} />
                            </div>

                            <div>
                                <h2 className="font-semibold">
                                    Zivo AI Assistant
                                </h2>
                                <p className="text-xs text-white/70">
                                    Shopping assistant
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onToggle}
                            aria-label="Close chatbot"
                            className="rounded-lg p-2 transition hover:bg-white/10"
                        >
                            <X size={20} />
                        </button>
                    </header>

                    <div
                        className="flex-1 space-y-4 overflow-y-auto bg-ink-50 p-4"
                        aria-live="polite"
                    >
                        {messages.length === 0 && (
                            <div className="rounded-xl border border-ink-200 bg-white p-4">
                                <p className="font-medium text-ink-950">
                                    Hi! What are you looking for?
                                </p>

                                <p className="mt-1 text-sm text-ink-500">
                                    Ask me about products, prices, stock,
                                    or your shopping cart.
                                </p>
                            </div>
                        )}

                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex gap-2 ${
                                    message.role === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                }`}
                            >
                                {message.role === "assistant" && (
                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ink-200 text-ink-700">
                                        <Bot size={17} />
                                    </div>
                                )}

                                <div
                                    className={`max-w-[85%] min-w-0 rounded-2xl px-3 py-2.5 text-sm ${
                                        message.role === "user"
                                            ? "bg-ink-950 text-white"
                                            : "border border-ink-200 bg-white text-ink-900"
                                    }`}
                                >
                                    {message.role === "assistant" ? (
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                p: ({ children }) => (
                                                    <p className="mb-2 leading-6 last:mb-0">
                                                        {children}
                                                    </p>
                                                ),

                                                strong: ({ children }) => (
                                                    <strong className="font-semibold text-ink-950">
                                                        {children}
                                                    </strong>
                                                ),

                                                em: ({ children }) => (
                                                    <em>{children}</em>
                                                ),

                                                ul: ({ children }) => (
                                                    <ul className="mb-2 ml-5 list-disc space-y-1 last:mb-0">
                                                        {children}
                                                    </ul>
                                                ),

                                                ol: ({ children }) => (
                                                    <ol className="mb-2 ml-5 list-decimal space-y-1 last:mb-0">
                                                        {children}
                                                    </ol>
                                                ),

                                                li: ({ children }) => (
                                                    <li className="pl-0.5">
                                                        {children}
                                                    </li>
                                                ),

                                                h1: ({ children }) => (
                                                    <h3 className="mb-2 mt-3 text-base font-bold first:mt-0">
                                                        {children}
                                                    </h3>
                                                ),

                                                h2: ({ children }) => (
                                                    <h3 className="mb-2 mt-3 text-sm font-bold first:mt-0">
                                                        {children}
                                                    </h3>
                                                ),

                                                h3: ({ children }) => (
                                                    <h3 className="mb-1 mt-3 font-semibold first:mt-0">
                                                        {children}
                                                    </h3>
                                                ),

                                                a: ({ href, children }) => (
                                                    <a
                                                        href={href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="break-all text-blue-700 underline underline-offset-2"
                                                    >
                                                        {children}
                                                    </a>
                                                ),

                                                blockquote: ({ children }) => (
                                                    <blockquote className="my-2 border-l-2 border-ink-300 pl-3 text-ink-600">
                                                        {children}
                                                    </blockquote>
                                                ),

                                                code: ({ children }) => (
                                                    <code className="break-words rounded bg-ink-100 px-1 py-0.5 text-[0.85em]">
                                                        {children}
                                                    </code>
                                                ),

                                                table: ({ children }) => (
                                                    <div className="my-2 max-w-full overflow-x-auto">
                                                        <table className="w-full border-collapse text-left text-xs">
                                                            {children}
                                                        </table>
                                                    </div>
                                                ),

                                                th: ({ children }) => (
                                                    <th className="border border-ink-200 bg-ink-50 px-2 py-1 font-semibold">
                                                        {children}
                                                    </th>
                                                ),

                                                td: ({ children }) => (
                                                    <td className="border border-ink-200 px-2 py-1 align-top">
                                                        {children}
                                                    </td>
                                                ),
                                            }}
                                        >
                                            {message.content}
                                        </ReactMarkdown>
                                    ) : (
                                        <p className="whitespace-pre-wrap break-words">
                                            {message.content}
                                        </p>
                                    )}
                                </div>

                                {message.role === "user" && (
                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ink-200 text-ink-700">
                                        <User size={17} />
                                    </div>
                                )}
                            </div>
                        ))}

                        {loading && (
                            <div
                                className="flex items-center gap-2 text-sm text-ink-500"
                                role="status"
                            >
                                <Bot size={18} />
                                <span>AI is thinking...</span>
                            </div>
                        )}

                        {errorMessage && (
                            <div
                                className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                                role="alert"
                            >
                                {errorMessage}
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    <form
                        onSubmit={onSubmit}
                        className="flex items-end gap-2 border-t border-ink-200 bg-white p-3"
                    >
                        <textarea
                            value={input}
                            onChange={(event) => onInputChange(event.target.value)}
                            onKeyDown={onInputKeyDown}
                            placeholder="Ask about a product..."
                            aria-label="Chat message"
                            rows={1}
                            maxLength={2000}
                            disabled={loading || !threadReady}
                            className="max-h-28 min-h-11 flex-1 resize-y rounded-xl border border-ink-200 px-3 py-3 text-sm outline-none focus:border-ink-500 disabled:opacity-60"
                        />

                        <button
                            type="submit"
                            disabled={
                                loading ||
                                !threadReady ||
                                !input.trim()
                            }
                            aria-label="Send message"
                            className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-ink-950 text-white transition hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </section>
            )}

            <button
                type="button"
                onClick={onToggle}
                aria-label={
                    isOpen
                        ? "Close chat assistant"
                        : "Open chat assistant"
                }
                aria-expanded={isOpen}
                className="ml-auto flex size-14 items-center justify-center rounded-full bg-ink-950 text-white shadow-lg transition hover:scale-105 hover:bg-ink-800"
            >
                {isOpen ? (
                    <X size={24} />
                ) : (
                    <MessageCircle size={24} />
                )}
            </button>
        </div>
    );
}