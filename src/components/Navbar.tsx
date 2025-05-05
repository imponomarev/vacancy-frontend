"use client";
import Link from "next/link";
import {useSession, signOut} from "next-auth/react";
import {Button} from "@heroui/react";

export default function Navbar() {
    const {data: session} = useSession();

    return (
        <header className="sticky top-0 bg-white shadow px-4 py-2 flex items-center gap-4">
            <Link href="/" className="font-bold text-primary">VacAgg</Link>
            <Link href="/vacancies">Вакансии</Link>
            <Link href="/resumes">Резюме</Link>
            {session && <Link href="/dashboard/favourites">Избранное</Link>}
            <div className="ml-auto">
                {session ? (
                    <Button size="sm" variant="ghost" onClick={() => signOut()}>Выйти</Button>
                ) : (
                    <>
                        <Link href="/login" className="mr-2 text-sm">Вход</Link>
                        <Link href="/register" className="text-sm">Регистрация</Link>
                    </>
                )}
            </div>
        </header>
    );
}
