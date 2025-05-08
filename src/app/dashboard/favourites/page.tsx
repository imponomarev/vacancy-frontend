"use client";

import { signIn, useSession } from "next-auth/react";
import { Skeleton } from "@heroui/react";
import { useVacancyFavourites, useResumeFavourites } from "@/hooks/useFavourites";
import VacancyCard from "@/components/VacancyCard";
import ResumeCard from "@/components/ResumeCard";

export default function FavPage() {
    const { data: session, status } = useSession();

    // Вакансии всегда
    const { data: vac = [] } = useVacancyFavourites();

    // Резюме — первый аргумент фильтры ({}),
    // второй — опции react-query
    const { data: res = [] } = useResumeFavourites(
        {},
        { enabled: session?.user.role === "PRO" }
    );

    if (status === "unauthenticated") {
        signIn(undefined, { callbackUrl: "/login" });
        return <Skeleton className="h-32 w-full" />;
    }
    if (status === "loading") {
        return <Skeleton className="h-32 w-full" />;
    }

    return (
        <section className="container mx-auto py-6 px-4">
            <h2 className="text-xl font-bold mb-4">Мои вакансии</h2>
            <div className="grid gap-4">
                {vac.map((v) => <VacancyCard v={v} key={v.externalId} />)}
            </div>

            {session.user.role === "PRO" ? (
                <>
                    <h2 className="text-xl font-bold my-4">Мои резюме</h2>
                    <div className="grid gap-4">
                        {res.map((r) => <ResumeCard r={r} key={r.externalId} />)}
                    </div>
                </>
            ) : (
                <div className="mt-6 text-center text-gray-500">
                    Резюме доступны только для PRO-подписчиков
                </div>
            )}
        </section>
    );
}
