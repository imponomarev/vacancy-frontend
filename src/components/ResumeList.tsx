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

    const text       = sp.get("text")       || "";
    const area       = sp.get("area")       || "";
    const perPageStr = sp.get("perPage")    || "20";
    const salaryFrom = sp.get("salaryFrom") || "";
    const salaryTo   = sp.get("salaryTo")   || "";
    const ageFrom    = sp.get("ageFrom")    || "";
    const ageTo      = sp.get("ageTo")      || "";
    const experience = sp.get("experience") || "";
    const schedule   = sp.get("schedule")   || "";
    const education  = sp.get("education")  || "";
    const providers  = sp.getAll("providers");

    const [page, setPage]             = useState(0);
    const [hasQueried, setHasQueried] = useState(false);
    const isPro = session?.user.role === "PRO";
    const enabled = isPro && text.trim() !== "" && area.trim() !== "";

    // помечаем, что первый запрос уже был
    useEffect(() => {
        if (enabled) setHasQueried(true);
    }, [enabled]);

    // сбрасываем страницу при изменении фильтров
    useEffect(() => {
        setPage(0);
    }, [
        text,
        area,
        perPageStr,
        salaryFrom,
        salaryTo,
        ageFrom,
        ageTo,
        experience,
        schedule,
        education,
        providers, // массив целиком
    ]);

    // сам запрос
    const {
        data: resumes = [],
        isLoading,
        isError,
        error,
        isFetching,
    } = useResumeSearch(
        {
            text,
            area,
            page,
            perPage: Number(perPageStr),
            providers: providers.length > 0 ? providers : undefined,
            salaryFrom: salaryFrom ? Number(salaryFrom) : undefined,
            salaryTo:   salaryTo   ? Number(salaryTo)   : undefined,
            ageFrom:    ageFrom    ? Number(ageFrom)    : undefined,
            ageTo:      ageTo      ? Number(ageTo)      : undefined,
            experience: experience || undefined,
            schedule:   schedule   || undefined,
            education:  education  || undefined,
        },
        {
            query: {
                enabled,
                keepPreviousData: true,
            },
        }
    );

    // 1) пока грузится сессия
    if (status === "loading") {
        return <Skeleton className="h-32 w-full" />;
    }

    // 2) если не PRO
    if (!isPro) {
        return (
            <p className="text-center py-10">
                Поиск резюме доступен только пользователям Pro.
            </p>
        );
    }

    // 3) loading
    if (isLoading) {
        return <Skeleton className="h-32 w-full" />;
    }

    // 4) ошибка
    if (isError) {
        const msg =
            (error as any)?.response?.data?.message || "Ошибка загрузки резюме";
        return <p className="text-red-500 py-4 text-center">{msg}</p>;
    }

    // 5) ничего не найдено
    if (hasQueried && !isFetching && resumes.length === 0) {
        return (
            <p className="text-center py-10 text-gray-500">
                Ничего не найдено
            </p>
        );
    }

    // 6) список + “Ещё”
    const noMore = resumes.length < Number(perPageStr);
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
