"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, Badge, Skeleton } from "@heroui/react";
import { useSearch as useVacancySearch } from "@/api/vacancy-controller/vacancy-controller";
import LoadMoreButton from "./LoadMoreButton";
import VacancyCard from "@/components/VacancyCard";

export default function VacancyList() {
    const sp = useSearchParams();
    const { text, area, perPage = "20" } = Object.fromEntries(
        sp.entries()
    ) as Record<string, string>;

    const [page, setPage] = useState(0);

    const query = useVacancySearch(
        { text, area, page, perPage: Number(perPage) },
        {
            query: {
                enabled: !!text && !!area,
                keepPreviousData: true,
            },
        }
    );

    const vacancies = query.data ?? [];
    const noMore = vacancies.length < Number(perPage);

    // сбрасываем страницу при смене фильтров
    useEffect(() => {
        setPage(0);
    }, [text, area]);

    if (query.isFetching && page === 0) {
        return <Skeleton className="h-32 w-full" />;
    }

    return (
        <>
            <div className="grid gap-4 mt-6">
                {vacancies.map((v) => (
                    <VacancyCard v={v} key={v.externalId}/>
                ))}
            </div>

            {!noMore && (
                <LoadMoreButton
                    onClick={() => setPage((p) => p + 1)}
                    disabled={query.isFetching}
                />
            )}
        </>
    );
}
