"use client";

import {useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {Card, Skeleton} from "@heroui/react";
import {useSearch as useVacancySearch} from "@/api/vacancy-controller/vacancy-controller";
import LoadMoreButton from "./LoadMoreButton";
import VacancyCard from "@/components/VacancyCard";

export default function VacancyList() {
    const sp = useSearchParams();
    const {text, area, perPage = "20"} = Object.fromEntries(
        sp.entries()
    ) as Record<string, string>;

    const [page, setPage] = useState(0);
    const query = useVacancySearch(
        {text, area, page, perPage: Number(perPage)},
        {
            query: {
                enabled: !!text && !!area,
                keepPreviousData: true,
            },
        }
    );

    // 1) Ошибка запроса → показываем текст из response.data.message
    if (!query.isFetching && query.isError) {
        const err = query.error as any;
        const msg = err.response?.data?.message || "Ошибка загрузки вакансий";
        return <p className="text-red-500 py-4 text-center">{msg}</p>;
    }

    const vacancies = query.data ?? [];
    const noMore = vacancies.length < Number(perPage);

    // Сбрасываем страницу при смене параметров
    useEffect(() => {
        setPage(0);
    }, [text, area]);

    if (query.isFetching && page === 0) {
        return <Skeleton className="h-32 w-full"/>;
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
