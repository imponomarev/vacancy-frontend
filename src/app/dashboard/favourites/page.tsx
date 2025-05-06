"use client";
import {useSession} from "next-auth/react";
import {useVacancyFavourites, useResumeFavourites} from "@/hooks/useFavourites";
import VacancyCard from "@/components/VacancyCard";
import ResumeCard from "@/components/ResumeCard";

export default function FavPage() {
    const {data: sess} = useSession();
    const {data: vac = []} = useVacancyFavourites();
    const {data: res = []} = useResumeFavourites({
        enabled: sess?.user.role === "PRO",
    });

    return (
        <section className="container mx-auto py-6 px-4">
            <h2 className="text-xl font-bold mb-4">Мои вакансии</h2>
            <div className="grid gap-4">{vac.map((v) => <VacancyCard v={v} key={v.externalId}/>)}</div>

            {sess?.user.role === "PRO" && (
                <>
                    <h2 className="text-xl font-bold my-4">Мои резюме</h2>
                    <div className="grid gap-4">{res.map((r) => <ResumeCard r={r} key={r.externalId}/>)}</div>
                </>
            )}
        </section>
    );
}
