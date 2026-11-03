import { Suspense } from "react";
import { Navbar } from "@/components/shared/navbar";
import { ChatWidget } from "@/components/chatbot/chat-widget";
import { Footer } from "@/components/shared/footer";

export default function ShopLayout({
    children,
}: {
children: React.ReactNode 
}) {
    return (
        <>
        <Suspense
            fallback={
                <div
                    className="h-[80px]"
                    aria-hidden="true"
                />
            }
        >
            <Navbar />
        </Suspense>
        
        <main>{children}</main>

        <Footer />

        <ChatWidget />
        </>
    );
}
