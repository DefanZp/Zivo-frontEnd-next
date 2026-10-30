import { NextRequest, NextResponse } from "next/server";

// export const runtime = "nodejs";
// export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
    const authorization = request.headers.get("authorization");

    // Guest tidak mengirim Authorization.
    // Jika dikirim, format token harus valid.
    if (
        authorization &&
        (
            !authorization.startsWith("Bearer ") ||
            !authorization.slice(7).trim()
        )
    ) {
        return NextResponse.json(
            { message: "Invalid Authorization header." },
            { status: 401 },
        );
    }

    try {
        const body: unknown = await request.json();

        if (
            typeof body !== "object" ||
            body === null ||
            !("thread_id" in body) ||
            !("user_message" in body) ||
            typeof body.thread_id !== "string" ||
            !body.thread_id.trim() ||
            typeof body.user_message !== "string" ||
            !body.user_message.trim()
        ) {
            return NextResponse.json(
                { message: "Invalid chat request." },
                { status: 422 },
            );
        }

        const aiServiceUrl = process.env.AI_SERVICE_URL;

        if (!aiServiceUrl) {
            return NextResponse.json(
                { message: "AI service is not configured." },
                { status: 500 },
            );
        }

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
        };

        if (authorization) {
            headers.Authorization = authorization;
        }

        const response = await fetch(
            `${aiServiceUrl.replace(/\/$/, "")}/chat/stream`,
            {
                method: "POST",
                headers,
                body: JSON.stringify({
                    thread_id: body.thread_id,
                    user_message: body.user_message.trim(),
                }),
                cache: "no-store",
            },
        );

        // Tangani HTTP error yang dikembalikan sebelum stream dimulai.
        if (!response.ok) {
            const errorBody: unknown = await response
                .json()
                .catch(() => null);

            return NextResponse.json(
                errorBody ?? {
                    message: "AI service request failed.",
                },
                { status: response.status },
            );
        }

        const contentType =
            response.headers.get("content-type") ?? "";

        if (!contentType.includes("text/event-stream")) {
            return NextResponse.json(
                { message: "AI service did not return an SSE stream." },
                { status: 502 },
            );
        }

        if (!response.body) {
            return NextResponse.json(
                { message: "AI service returned an empty stream." },
                { status: 502 },
            );
        }

        // Teruskan stream langsung tanpa membaca seluruh body.
        return new Response(response.body, {
            status: response.status,
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "no-cache, no-transform",
                "X-Accel-Buffering": "no",
            },
        });
    } catch (error) {
        console.error("[CHAT STREAM] Request failed:", error);

        return NextResponse.json(
            { message: "Unable to reach the AI service." },
            { status: 502 },
        );
    }
}