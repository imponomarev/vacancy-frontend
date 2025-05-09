"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@heroui/react";
import { useSearch as useVacancySearch } from "@/api/vacancy-controller/vacancy-controller";
import LoadMoreButton from "./LoadMoreButton";
import VacancyCard from "@/components/VacancyCard";

export default function VacancyList() {
    const sp = useSearchParams();

    // 1) Читаем из URL параметры
    const text          = sp.get("text")       || "";
    const area          = sp.get("area")       || "";
    const perPageStr    = sp.get("perPage")    || "20";
    const salaryFromStr = sp.get("salaryFrom") || "";
    const salaryToStr   = sp.get("salaryTo")   || "";
    const experience    = sp.get("experience") || "";
    const providers     = sp.getAll("providers"); // массив всех провайдеров

    // Состояния страницы и накопленных элементов
    const [page, setPage]             = useState(0);
    const [items, setItems]           = useState<typeof vacancies>([]);
    const [hasQueried, setHasQueried] = useState(false);

    // Флаг «начало поиска»
    const enabled = !!text.trim() && !!area.trim();
    useEffect(() => {
        if (enabled) setHasQueried(true);
    }, [enabled]);

    // Сбрасываем страницу и очистка кэша при изменении любого фильтра
    useEffect(() => {
        setPage(0);
        setItems([]);
    }, [
        text,
        area,
        perPageStr,
        salaryFromStr,
        salaryToStr,
        experience,
        providers.join(","), // одна зависимость вместо spread
    ]);

    // Делаем запрос по текущим параметрам
    const {
        data: vacancies = [],
        isLoading,
        isError,
        error,
        isFetching,
    } = useVacancySearch(
        {
            text,
            area,
            page,
            perPage: Number(perPageStr),
            providers: providers.length ? providers : undefined,
            salaryFrom: salaryFromStr ? Number(salaryFromStr) : undefined,
            salaryTo:   salaryToStr   ? Number(salaryToStr)   : undefined,
            experience: experience || undefined,
        },
        { query: { enabled, keepPreviousData: true } }
    );

    // Накопление результатов постранично
    useEffect(() => {
        if (!isLoading && enabled) {
            if (page === 0) {
                setItems(vacancies);
            } else {
                setItems(prev => [...prev, ...vacancies]);
            }
        }
    }, [vacancies, isLoading, page, enabled]);

    // UI-станы
    if (isLoading && page === 0) {
        return <Skeleton className="h-32 w-full" />;
    }
    if (isError) {
        const msg = (error as any)?.response?.data?.message || "Ошибка загрузки вакансий";
        return <p className="text-red-500 py-4 text-center">{msg}</p>;
    }
    if (hasQueried && !isFetching && items.length === 0) {
        return <p className="text-center py-10 text-gray-500">Ничего не найдено</p>;
    }

    // Проверка, есть ли ещё страницы
    const noMore = vacancies.length < Number(perPageStr);

    return (
        <>
            <div className="grid gap-4 mt-6">
                {items.map((v, idx) => {
                    // Гарантированно уникальный ключ:
                    const key = `${v.externalId ?? ""}-${idx}`;
                    return <VacancyCard v={v} key={key} />;
                })}
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
