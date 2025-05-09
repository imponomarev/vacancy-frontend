"use client";

import {useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {Skeleton} from "@heroui/react";
import {useSession} from "next-auth/react";
import {useSearch1 as useResumeSearch} from "@/api/resume-controller/resume-controller";
import LoadMoreButton from "./LoadMoreButton";
import ResumeCard from "./ResumeCard";

export default function ResumeList() {
    const {data: session, status} = useSession();
    const isPro = session?.user.role === "PRO";
    const sp = useSearchParams();

    // парсим параметры
    const text = sp.get("text") || "";
    const area = sp.get("area") || "";
    const perPageStr = sp.get("perPage") || "20";
    const salaryFrom = sp.get("salaryFrom") || "";
    const salaryTo = sp.get("salaryTo") || "";
    const ageFrom = sp.get("ageFrom") || "";
    const ageTo = sp.get("ageTo") || "";
    const experience = sp.get("experience") || "";
    const schedule = sp.get("schedule") || "";
    const education = sp.get("education") || "";
    const providers = sp.getAll("providers");

    const [page, setPage] = useState(0);
    const [queried, setQueried] = useState(false);

    // пометим, что юзер начал поиск
    useEffect(() => {
        if (isPro && text.trim() && area.trim()) setQueried(true);
    }, [isPro, text, area]);

    // сброс страницы при смене фильтров
    useEffect(() => {
        setPage(0);
    }, [
        text, area, perPageStr,
        salaryFrom, salaryTo, ageFrom, ageTo,
        experience, schedule, education,
        providers.join(","),
    ]);

    const shouldEnable = isPro && text.trim().length > 0 && area.trim().length > 0;

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
            providers: providers.length ? providers : undefined,
            salaryFrom: salaryFrom ? Number(salaryFrom) : undefined,
            salaryTo: salaryTo ? Number(salaryTo) : undefined,
            ageFrom: ageFrom ? Number(ageFrom) : undefined,
            ageTo: ageTo ? Number(ageTo) : undefined,
            experience: experience || undefined,
            schedule: schedule || undefined,
            education: education || undefined,
        },
        {
            query: {
                enabled: shouldEnable,
                keepPreviousData: true,
            },
        }
    );

    // состояния до результатов
    if (status === "loading" || (isLoading && page === 0)) {
        return <Skeleton className="h-32 w-full"/>;
    }
    if (!isPro) {
        return (
            <p className="text-center py-10 text-[var(--muted-600)]">
                Поиск резюме доступен только пользователям Pro.
            </p>
        );
    }
    if (isError) {
        const msg = (error as any)?.response?.data?.message || "Ошибка загрузки резюме";
        return <p className="text-[var(--danger)] py-4 text-center">{msg}</p>;
    }
    if (queried && !isFetching && resumes.length === 0) {
        return (
            <p className="text-center py-10 text-[var(--muted-500)]">
                Ничего не найдено
            </p>
        );
    }

    const noMore = resumes.length < Number(perPageStr);

    return (
        <>
            <div className="grid gap-4 mt-6">
                {resumes.map((r) => (
                    <ResumeCard r={r} key={r.externalId}/>
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
