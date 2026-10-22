
import { NextRequest, NextResponse } from "next/server";
import { request as undiciRequest } from "undici";

export async function POST(request: NextRequest) {
    const authorization = request.headers.get("authorization");

    // Jika header autentikasi dikirim, formatnya harus valid.
    // Jika tidak ada, request diperlakukan sebagai guest.
    if (
        authorization &&
        (
            !authorization.startsWith("Bearer ") ||
            !authorization.slice(7).trim()
        )
    ) {
        return NextResponse.json(
            { message: "Invalid Authorization header." },
            { status: 401 }
        );
    }

    try {
        const body = await request.json();

        const threadId = body.thread_id;
        const userMessage = body.user_message;

        if (
            typeof threadId !== "string" ||
            !threadId.trim() ||
            typeof userMessage !== "string" ||
            !userMessage.trim()
        ) {
            return NextResponse.json(
                { message: "Invalid chat request." },
                { status: 422 }
            );
        }

        const aiServiceUrl = process.env.AI_SERVICE_URL;

        if (!aiServiceUrl) {
            return NextResponse.json(
                { message: "AI service is not configured." },
                { status: 500 }
            );
        }

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            Accept: "application/json",
        };

        // Guest tidak mengirim token.
        // User login tetap meneruskan tokennya.
        if (authorization) {
            headers.Authorization = authorization;
        }

        const response = await undiciRequest(
            `${aiServiceUrl}/chat`,
            {
                method: "POST",
                headers,
                body: JSON.stringify({
                    thread_id: threadId,
                    user_message: userMessage.trim(),
                }),
                headersTimeout: 0,
                bodyTimeout: 0,
            }
        );

        const responseText = await response.body.text();

        let data: unknown;

        try {
            data = JSON.parse(responseText);
        } catch {
            return NextResponse.json(
                {
                    message:
                        "AI service returned a non-JSON response.",
                },
                { status: 502 }
            );
        }

        return NextResponse.json(data, {
            status: response.statusCode,
        });
    } catch (error) {
        const isTimeout =
            error instanceof Error &&
            error.name === "TimeoutError";

        return NextResponse.json(
            {
                message: isTimeout
                    ? "AI service request timed out."
                    : "Unable to reach the AI service.",
            },
            { status: 502 }
        );
    }
}
