import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api-response";
import type { Payment, SnapToken } from "@/types/payment";

interface SnapCallbacks {
    onSuccess?: (result: unknown) => void;
    onPending?: (result: unknown) => void;
    onError?: (result: unknown) => void;
    onClose?: () => void;
}

interface MidtransSnap {
    pay(
        snapToken: string,
        callbacks?: SnapCallbacks
    ): void;
}

declare global {
    interface Window {
        snap?: MidtransSnap;
    }
}

export const paymentService = {
    getSnapToken(token: string, paymentId: number) {
        return apiClient<ApiResponse<SnapToken>>(
            `/payments/${paymentId}/snap-token`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({}),
            }
        );
    },

    loadSnapScript(): Promise<void> {
        if (typeof window === "undefined") {
            return Promise.reject(
                new Error("Midtrans Snap can only run in the browser.")
            );
        }

        if (window.snap) {
            return Promise.resolve();
        }

        const clientKey =
            process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

        const scriptUrl =
            process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL;

        if (!clientKey || !scriptUrl) {
            return Promise.reject(
                new Error("Midtrans environment variables are missing.")
            );
        }

        return new Promise((resolve, reject) => {
            const existingScript =
                document.querySelector<HTMLScriptElement>(
                    "#midtrans-snap-script"
                );

            if (existingScript) {
                existingScript.addEventListener("load", () => resolve(), {
                    once: true,
                });

                existingScript.addEventListener("error", () => reject(
                    new Error("Failed to load Midtrans Snap.")
                ), {
                    once: true,
                });

                return;
            }

            const script = document.createElement("script");

            script.id = "midtrans-snap-script";
            script.src = scriptUrl;
            script.setAttribute("data-client-key", clientKey);
            script.async = true;

            script.onload = () => {
                if (window.snap) {
                    resolve();
                    return;
                }

                reject(
                    new Error("Midtrans Snap loaded, but its API is unavailable.")
                );
            };

            script.onerror = () => {
                reject(new Error("Failed to load Midtrans Snap."));
            };

            document.body.appendChild(script);
        });
    },

    openPayment(
        snapToken: string,
        callbacks?: SnapCallbacks
    ) {
        if (!window.snap) {
            throw new Error("Midtrans Snap has not been loaded.");
        }

        window.snap.pay(snapToken, callbacks);
    },

    getPaymentByGatewayOrderId(
        token: string,
        gatewayOrderId: string
    ) {
        return apiClient<ApiResponse<Payment>>(
            `/payments/${encodeURIComponent(gatewayOrderId)}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    },
};