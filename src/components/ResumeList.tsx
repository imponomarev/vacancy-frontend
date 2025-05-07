"use client";

import {useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {Skeleton} from "@heroui/react";
import {useSearch1 as useResumeSearch} from "@/api/resume-controller/resume-controller";
import LoadMoreButton from "./LoadMoreButton";
import ResumeCard from "./ResumeCard";
import {useSession} from "next-auth/react";

export default function ResumeList() {
    const {data: session, status} = useSession();
    const sp = useSearchParams();
    const {text, area, perPage = "20"} = Object.fromEntries(
        sp.entries()
    ) as Record<string, string>;

    // 1) Ждём загрузки сессии
    if (status === "loading") {
        return <Skeleton className="h-32 w-full"/>;
    }

    // 2) Блокируем free-пользователей
    if (session?.user.role !== "PRO") {
        return (
            <p className="text-center py-10">
                Поиск резюме доступен только пользователям Pro.
            </p>
        );
    }

    const [page, setPage] = useState(0);
    const query = useResumeSearch(
        {text, area, page, perPage: Number(perPage)},
        {query: {enabled: !!text && !!area, keepPreviousData: true}}
    );

    // 3) Ошибка запроса → выводим текст
    if (!query.isFetching && query.isError) {
        const err = query.error as any;
        const msg = err.response?.data?.message || "Ошибка загрузки резюме";
        return <p className="text-red-500 py-4 text-center">{msg}</p>;
    }

    const resumes = query.data ?? [];
    const noMore = resumes.length < Number(perPage);

    useEffect(() => setPage(0), [text, area]);

    if (query.isFetching && page === 0) {
        return <Skeleton className="h-32 w-full"/>;
    }

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
                    disabled={query.isFetching}
                />
            )}
        </>
    );
}
