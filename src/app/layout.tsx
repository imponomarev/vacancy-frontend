import "@/app/globals.css";
import QueryProvider from "@/components/QueryProvider";
import { HeroUIProvider } from "@heroui/react";
import { Inter } from "next/font/google";

const font = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata = { title: "Vacancy Aggregator" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ru" className="dark">
        <body className={`${font.className} bg-slate-50 dark:bg-slate-900`}>
        <HeroUIProvider>
            <QueryProvider>{children}</QueryProvider>
        </HeroUIProvider>
        </body>
        </html>
    );
}
