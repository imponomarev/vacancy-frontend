"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@heroui/react";
import { useSearch as useVacancySearch } from "@/api/vacancy-controller/vacancy-controller";
import LoadMoreButton from "./LoadMoreButton";
import VacancyCard from "@/components/VacancyCard";

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

    // устанавливаем флаг, что поиск начали
    useEffect(() => {
        if (text.trim() !== "" && area.trim() !== "") {
            setQueried(true);
        }
    }, [text, area]);

    // сброс при изменении фильтров
    useEffect(() => {
        setPage(0);
        setItems([]);
    }, [text, area, perPage, salaryFrom, salaryTo, experience, providers.join(",")]);

    // приводим enabled к булеву
    const shouldEnable = text.trim().length > 0 && area.trim().length > 0;

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
            providers: providers.length ? providers : undefined,
            salaryFrom: salaryFrom ? Number(salaryFrom) : undefined,
            salaryTo: salaryTo ? Number(salaryTo) : undefined,
            experience: experience || undefined,
        },
        {
            query: {
                enabled: shouldEnable,       // <-- здесь boolean
                keepPreviousData: true,
            },
        }
    );

    // накапливаем страницы
    useEffect(() => {
        if (!isLoading && queried) {
            setItems(prev => (page === 0 ? data : [...prev, ...data]));
        }
    }, [data, isLoading, page, queried]);

    // состояния UI
    if (isLoading && page === 0) {
        return <Skeleton className="h-32 w-full" />;
    }
    if (isError) {
        return (
            <p className="text-[var(--danger)] py-4 text-center">
                {(error as any)?.response?.data?.message || "Ошибка загрузки вакансий"}
            </p>
        );
    }
    if (queried && !isFetching && items.length === 0) {
        return (
            <p className="text-center py-10 text-[var(--muted-500)]">
                Ничего не найдено
            </p>
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
                    onClick={() => setPage(p => p + 1)}
                    disabled={isFetching}
                />
            )}
        </>
    );
}
