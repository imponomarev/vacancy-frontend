"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@heroui/react";
import { useSearch as useVacancySearch } from "@/api/vacancy-controller/vacancy-controller";
import LoadMoreButton from "./LoadMoreButton";
import VacancyCard from "@/components/VacancyCard";

export default function VacancyList() {
    const sp = useSearchParams();
    const { text = "", area = "", perPage = "20" } = Object.fromEntries(
        sp.entries()
    ) as Record<string, string>;

    const [page, setPage] = useState(0);

    const [hasQueried, setHasQueried] = useState(false);

    // включаем только если оба поля непустые
    const enabled = !!text && !!area;

    const {
        data: vacancies = [],
        isLoading,
        isError,
        error,
        isFetching,
    } = useVacancySearch(
        { text, area, page, perPage: Number(perPage) },
        {
            query: {
                enabled,
                keepPreviousData: true,
            },
        }
    );

    useEffect(() => {
        if (enabled) {
            setHasQueried(true);
        }
    }, [enabled]);

    // сбрасываем страницу при изменении поисковых параметров
    useEffect(() => {
        setPage(0);
    }, [text, area]);

    // 1) загрузка
    if (isLoading) {
        return <Skeleton className="h-32 w-full" />;
    }

    // 2) ошибка
    if (isError) {
        const msg =
            (error as any)?.response?.data?.message ||
            "Ошибка загрузки вакансий";
        return (
            <p className="text-red-500 py-4 text-center">
                {msg}
            </p>
        );
    }

    // 3) если нет результатов (и запрос уже точно отрабатывал)
    if (hasQueried && !isFetching && vacancies.length === 0) {
        return (
            <p className="text-center py-10 text-gray-500">
                Ничего не найдено
            </p>
        );
    }

    // 4) основной рендер списка + кнопка «Ещё»
    const noMore = vacancies.length < Number(perPage);

    return (
        <>
            <div className="grid gap-4 mt-6">
                {vacancies.map((v) => (
                    <VacancyCard v={v} key={v.externalId} />
                ))}
            </div>

            {!noMore && (
                <LoadMoreButton
                    onClick={() => setPage((p) => p + 1)}
                    disabled={isFetching}
                />
            )}
        </>
    );
}
