"use client";
import { useSearchParams } from "next/navigation";
import {useEffect, useState} from "react";
import { Card, Badge, Skeleton } from "@heroui/react";
import { useVacancyControllerSearch } from "@/api/vacancy-controller";
import LoadMoreButton from "./LoadMoreButton";

export default function VacancyList() {
    const sp = useSearchParams();
    const { text, area, perPage = "20" } = Object.fromEntries(
        sp.entries()
    ) as Record<string, string>;

    /** локальное состояние номера страницы— начинаем с 0,
     *   каждый «load more»→ increment */
    const [page, setPage] = useState(0);

    const { data, isFetching, refetch } = useVacancyControllerSearch(
        { text, area, page, perPage: Number(perPage) },
        {
            query: {
                enabled: !!text && !!area,
                keepPreviousData: true,
            },
        }
    );

    /** если пришло меньше, чем perPage— страниц больше нет */
    const noMore =
        (data?.length ?? 0) < Number(perPage) || data === undefined;

    const handleLoadMore = () => {
        if (!noMore) {
            setPage((p) => p + 1);
        }
    };

    // перезапускаем поиск, если пользователь изменил URL‑параметры
    // (например, вернулся стрелкой «назад» и поменял город)
    //  eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => setPage(0), [text, area]);

    if (isFetching && page === 0) {
        // первый запрос— показываем скелет
        return <Skeleton className="h-32 w-full" />;
    }

    return (
        <>
            <div className="grid gap-4 mt-6">
                {data?.map((v) => (
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
                <LoadMoreButton onClick={handleLoadMore} disabled={isFetching} />
            )}
        </>
    );
}
