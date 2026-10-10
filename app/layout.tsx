import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthStoreProvider } from "@/lib/stores/auth-store-provider";

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
      </body>
    </html>
  );
}
