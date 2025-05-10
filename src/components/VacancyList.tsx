"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSearch as useVacancySearch } from "@/api/vacancy-controller/vacancy-controller";
import LoadMoreButton from "./LoadMoreButton";
import VacancyCard from "@/components/VacancyCard";
import { LottieLoader } from "@/components/LottieLoader";

export default function VacancyList() {
    const sp = useSearchParams();
    const text = sp.get("text") || "";
    const area = sp.get("area") || "";
    const perPage = Number(sp.get("perPage") || "20");
    const salaryFrom = sp.get("salaryFrom") || "";
    const salaryTo = sp.get("salaryTo") || "";
    const experience = sp.get("experience") || "";
    const providers = sp.getAll("providers");

    const [page, setPage] = useState(0);
    const [items, setItems] = useState<any[]>([]);
    const [queried, setQueried] = useState(false);

    const shouldEnable = text.trim().length > 0 && area.trim().length > 0;

    // Сбрасываем всё при изменении фильтров
    useEffect(() => {
        setPage(0);
        setItems([]);
        setQueried(shouldEnable);
    }, [
        text,
        area,
        perPage,
        salaryFrom,
        salaryTo,
        experience,
        providers.join(","),
        shouldEnable,
    ]);

    // Сам запрос
    const {
        data = [],
        isLoading,
        isError,
        error,
        isFetching,
    } = useVacancySearch(
        {
            text,
            area,
            page,
            perPage,
            providers: providers.length > 0 ? providers : undefined,
            salaryFrom: salaryFrom ? Number(salaryFrom) : undefined,
            salaryTo: salaryTo ? Number(salaryTo) : undefined,
            experience: experience || undefined,
        },
        {
            query: {
                enabled: shouldEnable,
                keepPreviousData: true,
            },
        }
    );

    // Накопление страниц (только если нет ошибки)
    useEffect(() => {
        if (!isLoading && queried && !isError) {
            setItems(prev =>
                page === 0
                    ? data
                    : [
                        ...prev,
                        ...data,
                    ]
            );
        }
    }, [data, isLoading, page, queried, isError]);

    // UI-стейты
    if (isLoading && page === 0) {
        return <LottieLoader />;
    }
    if (isError) {
        const msg = (error as any)?.response?.data?.message || "Ошибка загрузки вакансий";
        return (
            <p className="text-[var(--danger)] py-4 text-center">{msg}</p>
        );
    }
    if (queried && !isFetching && items.length === 0) {
        return (
            <p className="text-center py-10 text-[var(--muted-500)]">Ничего не найдено</p>
        );
    }

    const noMore = data.length < perPage;

    return (
        <>
            <div className="grid gap-4 mt-6">
                {items.map((v, i) => (
                    <VacancyCard v={v} key={`${v.externalId}-${i}`} />
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
