"use client";
import {useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {Skeleton} from "@heroui/react";
import {useSearch1 as useResumeSearch} from "@/api/resume-controller/resume-controller";
import LoadMoreButton from "./LoadMoreButton";
import ResumeCard from "./ResumeCard";
import PaymentWidget from "@/components/PaymentWidget";

export default function ResumeList() {
    const sp = useSearchParams();
    const {text, area, perPage = "20"} = Object.fromEntries(
        sp.entries()
    ) as Record<string, string>;

    const [page, setPage] = useState(0);

    const query = useResumeSearch(
        {text, area, page, perPage: Number(perPage)},
        {query: {enabled: !!text && !!area, keepPreviousData: true}}
    );

    if (query.error && (query.error as any).response?.status === 403) {
        return (
            <div className="mt-10 text-center">
                <p className="mb-4 text-lg">
                    Поиск резюме доступен только пользователям Pro.
                </p>
                <PaymentWidget onSuccess={() => query.refetch()} />
            </div>
        );
    }

    const resumes = query.data ?? [];
    const noMore = resumes.length < Number(perPage);

    useEffect(() => setPage(0), [text, area]);

    if (query.isFetching && page === 0) return <Skeleton className="h-32 w-full"/>;

    return (
        <>
            <div className="grid gap-4 mt-6">
                {resumes.map((r) => (
                    <ResumeCard r={r} key={r.externalId}/>
                ))}
            </div>
            {!noMore && (
                <LoadMoreButton onClick={() => setPage((p) => p + 1)} disabled={query.isFetching}/>
            )}
        </>
    );
}
