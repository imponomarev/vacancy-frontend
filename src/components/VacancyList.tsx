"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, Badge, Skeleton } from "@heroui/react";
import { useSearch as useVacancySearch } from "@/api/vacancy-controller/vacancy-controller";
import LoadMoreButton from "./LoadMoreButton";

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
                    <Card key={v.externalId} className="p-4">
                        <h3 className="text-lg font-semibold">{v.title}</h3>
                        <p className="text-sm text-slate-500">{v.company}</p>
                        {v.salaryFrom && (
                            <Badge className="mt-2">
                                {v.salaryFrom}‑{v.salaryTo ?? "…"} {v.currency}
                            </Badge>
                        )}
                    </Card>
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
