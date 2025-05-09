"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@heroui/react";

export default function Navbar() {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const router = useRouter();

    const navLink = (href: string, label: string, extra?: any) => {
        const isActive = pathname.startsWith(href);
        return (
            <Link
                href={href}
                {...extra}
                className={`
          px-3 py-1 rounded-md
          ${isActive
                    ? "text-[var(--primary)] font-semibold border-b-2 border-[var(--primary)]"
                    : "text-[var(--muted-700)] hover:text-[var(--primary-light)]"}
          transition
        `}
            >
                {label}
            </Link>
        );
    };

    return (
        <header className="sticky top-0 z-30 backdrop-blur bg-[var(--bg)]/70 dark:bg-[var(--bg)]/70 shadow-md px-6 py-3 flex items-center">
            <Link
                href="/vacancies"
                className="font-bold text-2xl tracking-tight text-[var(--primary)]"
            >
                VacAgg
            </Link>

            <nav className="ml-8 flex gap-4">
                {navLink("/vacancies", "Вакансии")}
                {navLink(
                    "/resumes",
                    "Резюме",
                    status === "authenticated" && session?.user.role === "FREE"
                        ? {
                            onClick: (e: React.MouseEvent) => {
                                e.preventDefault();
                                router.push("/billing/pro");
                            },
                        }
                        : {}
                )}
                {status === "authenticated" && navLink("/dashboard/favourites", "Избранное")}
            </nav>

            <div className="ml-auto flex items-center gap-4">
                {status === "unauthenticated" && !["/login", "/register"].includes(pathname) && (
                    <>
                        <Link
                            href="/login"
                            className="text-sm text-[var(--muted-700)] hover:text-[var(--primary-light)]"
                        >
                            Вход
                        </Link>
                        <Link
                            href="/register"
                            className="text-sm text-[var(--muted-700)] hover:text-[var(--primary-light)]"
                        >
                            Регистрация
                        </Link>
                    </>
                )}

                {status === "authenticated" && (
                    <Button
                        size="sm"
                        variant="outline"
                        className={`
              text-sm
              border border-[var(--danger)]
              text-[var(--danger)]
              hover:bg-[var(--danger)]/10
              transition
            `}
                        onClick={() => signOut({ callbackUrl: "/login" })}
                    >
                        Выйти
                    </Button>
                )}
            </div>
        </header>
    );
}
