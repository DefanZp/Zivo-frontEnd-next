import { Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";

const jakartaSans = Plus_Jakarta_Sans({
    variable: "--font-jakarta-sans",
    subsets: ["latin"],
    display: "swap",
});

export default function ShopLayout({ children }: Readonly<{children: React.ReactNode;}>) {
    return (
        <div 
            className={`${jakartaSans.variable} min-h-screen`}>

            <main>{children}</main>
        </div>
    );
}