import type { ApiError } from "@/types/api-response";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000/api";

export async function apiClient<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const headers = new Headers(options?.headers);

    // FormData harus menggunakan Content-Type dari browser.
    // Untuk request selain FormData, gunakan JSON secara default.
    if (options?.body instanceof FormData) {
        headers.delete("Content-Type");
    } else if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const responseText = await response.text();

    let responseData: unknown = null;

    try {
        if (responseText) {
            responseData = JSON.parse(responseText);
        }
    } catch {
        console.error(
            `API returned a non-JSON response: ${endpoint}`,
            {
                status: response.status,
                contentType: response.headers.get("content-type"),
                preview: responseText.slice(0, 300),
            }
        );
    }

    if (!response.ok) {
        const errorBody =
            typeof responseData === "object" &&
            responseData !== null
                ? responseData as Record<string, unknown>
                : {};

        const message =
            typeof errorBody.message === "string"
                ? errorBody.message
                : `API request failed with status ${response.status}.`;

        const error = Object.assign(
            new Error(message),
            errorBody,
            {
                status: response.status,
                message,
            }
        );

        throw error as ApiError;
    }

    if (responseText && responseData === null) {
        throw new Error(
            `The API returned an invalid response for ${endpoint}.`
        );
    }

    return responseData as T;
}