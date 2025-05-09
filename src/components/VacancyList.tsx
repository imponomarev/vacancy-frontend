"use client";

import {useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {Skeleton} from "@heroui/react";
import {useSearch as useVacancySearch} from "@/api/vacancy-controller/vacancy-controller";
import LoadMoreButton from "./LoadMoreButton";
import VacancyCard from "@/components/VacancyCard";

export default function VacancyList() {
    const sp = useSearchParams();

    const text = sp.get("text") || "";
    const area = sp.get("area") || "";
    const perPageStr = sp.get("perPage") || "20";
    const salaryFromStr = sp.get("salaryFrom") || "";
    const salaryToStr = sp.get("salaryTo") || "";
    const experience = sp.get("experience") || "";
    const providers = sp.getAll("providers");

    const [page, setPage] = useState(0);
    const [hasQueried, setHasQueried] = useState(false);

    const enabled = !!text.trim() && !!area.trim();
    useEffect(() => {
        if (enabled) setHasQueried(true);
    }, [enabled]);

    useEffect(() => {
        setPage(0);
    }, [
        text, area, perPageStr,
        salaryFromStr, salaryToStr,
        experience, providers
    ]);

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
            providers: providers.length > 0 ? providers : undefined,
            salaryFrom: salaryFromStr ? Number(salaryFromStr) : undefined,
            salaryTo: salaryToStr ? Number(salaryToStr) : undefined,
            experience: experience || undefined,
        },
        {
            query: {
                enabled,
                keepPreviousData: true,
            },
        }
    );

    if (isLoading) {
        return <Skeleton className="h-32 w-full"/>;
    }

    if (isError) {
        const msg = (error as any)?.response?.data?.message
            || "Ошибка загрузки вакансий";
        return <p className="text-red-500 py-4 text-center">{msg}</p>;
    }

    if (hasQueried && !isFetching && vacancies.length === 0) {
        return <p className="text-center py-10 text-gray-500">Ничего не найдено</p>;
    }

    const noMore = vacancies.length < Number(perPageStr);

    return (
        <>
            <div className="grid gap-4 mt-6">
                {vacancies.map(v => <VacancyCard v={v} key={v.externalId}/>)}
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
