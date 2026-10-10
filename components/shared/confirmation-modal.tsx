
"use client";

import { useEffect } from "react";

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    description: string;

    confirmText?: string;
    cancelText?: string;
    loadingText?: string;

    isLoading?: boolean;
    variant?: "danger" | "primary";

    onConfirm: () => void | Promise<void>;
    onCancel: () => void;
}

export function ConfirmationModal({
    isOpen,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    loadingText = "Processing...",
    isLoading = false,
    variant = "primary",
    onConfirm,
    onCancel,
}: ConfirmationModalProps) {
    useEffect(() => {
        if (!isOpen || isLoading) {
            return;
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onCancel();
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, isLoading, onCancel]);

    if (!isOpen) {
        return null;
    }

    const confirmButtonClass =
        variant === "danger"
            ? "bg-red-600 hover:bg-red-700"
            : "bg-ink-900 hover:bg-ink-700";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5"
            onMouseDown={(event) => {
                if (
                    event.target === event.currentTarget &&
                    !isLoading
                ) {
                    onCancel();
                }
            }}
        >
            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirmation-modal-title"
                aria-describedby="confirmation-modal-description"
                className="w-full max-w-md rounded-xl border border-ink-100 bg-white p-6 shadow-xl"
            >
                <h2
                    id="confirmation-modal-title"
                    className="text-lg font-semibold text-ink-950"
                >
                    {title}
                </h2>

                <p
                    id="confirmation-modal-description"
                    className="mt-2 text-sm leading-relaxed text-ink-500"
                >
                    {description}
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        disabled={isLoading}
                        onClick={onCancel}
                        className="rounded-lg border border-ink-200 px-4 py-2 text-sm font-medium text-ink-700 transition hover:bg-ink-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => void onConfirm()}
                        className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${confirmButtonClass}`}
                    >
                        {isLoading ? loadingText : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
