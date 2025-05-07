"use client";

import Link from "next/link";
import {useSession, signOut} from "next-auth/react";
import {usePathname, useRouter} from "next/navigation";
import {Button} from "@heroui/react";

export default function Navbar() {
    const {data: session, status} = useSession();
    const path = usePathname();
    const router = useRouter();

    const handleResumesClick = (e: React.MouseEvent) => {
        if (status === "authenticated" && session?.user.role === "FREE") {
            e.preventDefault();
            router.push("/billing/pro");
        }
    };

    return (
        <header className="sticky top-0 bg-white shadow px-4 py-2 flex items-center gap-4">
            <Link href="/" className="font-bold text-primary">
                VacAgg
            </Link>

            <Link href="/vacancies">Вакансии</Link>

            <Link href="/resumes" onClick={handleResumesClick}>
                Резюме
            </Link>

            {status === "authenticated" && (
                <Link href="/dashboard/favourites">Избранное</Link>
            )}

            <div className="ml-auto flex items-center gap-2">
                {status === "unauthenticated" && path !== "/login" && (
                    <>
                        <Link href="/login" className="text-sm">
                            Вход
                        </Link>
                        <Link href="/register" className="text-sm">
                            Регистрация
                        </Link>
                    </>
                )}

                {status === "authenticated" && (
                    <Button size="sm" variant="ghost" onClick={() => signOut()}>
                        Выйти
                    </Button>
                )}
            </div>
        </header>
    );
}
