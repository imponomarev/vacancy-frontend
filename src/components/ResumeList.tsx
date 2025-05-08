"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@heroui/react";
import { useSession } from "next-auth/react";
import { useSearch1 as useResumeSearch } from "@/api/resume-controller/resume-controller";
import LoadMoreButton from "./LoadMoreButton";
import ResumeCard from "./ResumeCard";

export default function ResumeList() {
    const { data: session, status } = useSession();
    const sp = useSearchParams();
    const { text = "", area = "", perPage = "20" } = Object.fromEntries(
        sp.entries()
    ) as Record<string, string>;

    const [page, setPage] = useState(0);

    const [hasQueried, setHasQueried] = useState(false);

    const isPro = session?.user.role === "PRO";

    const enabled = isPro && !!text.trim() && !!area.trim();

    // хук вызываем всегда, но включаем запрос только для PRO
    const {
        data: resumes = [],
        isLoading,
        isError,
        error,
        isFetching,
    } = useResumeSearch(
        { text, area, page, perPage: Number(perPage) },
        {
            query: {
                enabled: isPro && !!text && !!area,
                keepPreviousData: true,
            },
        }
    );

    useEffect(() => {
        if (enabled) setHasQueried(true);
    }, [enabled]);

    // 1) пока сессия грузится
    if (status === "loading") {
        return <Skeleton className="h-32 w-full" />;
    }

    // 2) если не PRO — показываем заглушку
    if (!isPro) {
        return (
            <p className="text-center py-10">
                Поиск резюме доступен только пользователям Pro.
            </p>
        );
    }

    // сбрасываем страницу при смене фильтров
    useEffect(() => {
        setPage(0);
    }, [text, area]);

    // 3) загрузка резюме
    if (isLoading) {
        return <Skeleton className="h-32 w-full" />;
    }

    // 4) ошибка
    if (isError) {
        const msg =
            (error as any)?.response?.data?.message ||
            "Ошибка загрузки резюме";
        return (
            <p className="text-red-500 py-4 text-center">
                {msg}
            </p>
        );
    }

    // 5) если нет результатов
    if (hasQueried && !isFetching && resumes.length === 0) {
        return (
            <p className="text-center py-10 text-gray-500">
                Ничего не найдено
            </p>
        );
    }

    // 6) список и кнопка «Ещё»
    const noMore = resumes.length < Number(perPage);

    return (
        <>
            <div className="grid gap-4 mt-6">
                {resumes.map((r) => (
                    <ResumeCard r={r} key={r.externalId} />
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
