"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@heroui/react";

export default function Navbar() {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const router = useRouter();

    /** активная ссылка выделяется цветом и подчёркиванием */
    const navLink = (href: string, label: string, extra?: any) => (
        <Link
            href={href}
            {...extra}
            className={
                "px-2 py-1 " +
                (pathname.startsWith(href)
                    ? "text-primary font-semibold border-b-2 border-primary"
                    : "text-slate-700 dark:text-slate-200 hover:text-primary/80")
            }
        >
            {label}
        </Link>
    );

    return (
        <header className="sticky top-0 z-30 backdrop-blur bg-white/70 dark:bg-slate-800/70 shadow px-4 py-2 flex items-center gap-4">
            <Link href="/vacancies" className="font-bold text-xl tracking-tight text-primary">
                VacAgg
            </Link>

            {navLink("/vacancies", "Вакансии")}
            {navLink(
                "/resumes",
                "Резюме",
                status === "authenticated" && session?.user.role === "FREE"
                    ? { onClick: (e: React.MouseEvent) => (e.preventDefault(), router.push("/billing/pro")) }
                    : {},
            )}
            {status === "authenticated" && navLink("/dashboard/favourites", "Избранное")}

            <div className="ml-auto flex items-center gap-3">
                {status === "unauthenticated" && pathname !== "/login" && pathname !== "/register" && (
                    <>
                        <Link href="/login" className="text-sm hover:text-primary/80">
                            Вход
                        </Link>
                        <Link href="/register" className="text-sm hover:text-primary/80">
                            Регистрация
                        </Link>
                    </>
                )}

                {status === "authenticated" && (
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="text-sm"
                    >
                        Выйти
                    </Button>
                )}
            </div>
        </header>
    );
}
