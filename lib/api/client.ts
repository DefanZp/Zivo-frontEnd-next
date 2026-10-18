import type { ApiError } from "@/types/api-response";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000/api";

export async function apiClient<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const headers = new Headers(options?.headers);

    headers.set("Accept", "application/json");

    if (options?.body instanceof FormData) {
        headers.delete("Content-Type");
    } else if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (
        response.status === 401 &&
        headers.has("Authorization") &&
        typeof window !== "undefined"
    ) {
        window.dispatchEvent(new Event("zivo:unauthorized"));
    }

    const responseText = await response.text();
    let data: unknown = null;

    try {
        data = responseText ? JSON.parse(responseText) : null;
    } catch {
        throw new Error("API returned an invalid JSON response.");
    }

    if (!response.ok) {
        const errorBody =
            typeof data === "object" && data !== null
                ? data as Record<string, unknown>
                : {};

        const message =
            typeof errorBody.message === "string"
                ? errorBody.message
                : `API request failed with status ${response.status}.`;

        throw Object.assign(new Error(message), errorBody, {
            status: response.status,
            message,
        }) as ApiError;
    }

    return data as T;
}
