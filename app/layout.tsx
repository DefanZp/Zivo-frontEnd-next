import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthStoreProvider } from "@/lib/stores/auth-store-provider";
import { Toaster } from "sonner";


const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zivo",
  description: "Zivo E-commerce",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${jakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthStoreProvider>
          {children}
        </AuthStoreProvider>

        
        <Toaster
            position="top-right"
            duration={3000}
            closeButton
            visibleToasts={3}
            theme="light"
            toastOptions={{
                style: {
                    borderRadius: "10px",
                },
                classNames: {
                    success: "!bg-green-50 !border-green-200 !text-green-800",
                    error: "!bg-red-50 !border-red-200 !text-red-800",
                    info: "!bg-blue-50 !border-blue-200 !text-blue-800",
                },
            }}
        />
      </body>
    </html>
  );
}
