"use client";

import Link from "next/link";
import {Card, Badge} from "@heroui/react";
import {Heart, HeartOff} from "lucide-react";
import {Resume} from "@/api/model";
import {useResumeFavourites} from "@/hooks/useFavourites";

export default function ResumeCard({r}: { r: Resume }) {
    const {data: favs = [], toggle} = useResumeFavourites();
    const liked = favs.some(
        (f) => f.source === r.source && f.externalId === r.externalId
    );

    return (
        <Card
            className={`
        p-4 relative
        bg-[var(--bg)]
        rounded-lg
        shadow
        hover:shadow-lg
        hover:ring-1 hover:ring-[var(--primary)]
        focus:outline-none focus:ring-0
        transition
      `}
            as="div"
        >
            <button
                className="absolute top-3 right-3"
                onClick={(e) => {
                    e.stopPropagation();
                    toggle.mutate(r);
                }}
            >
                {liked ? (
                    <Heart className="h-5 w-5 fill-[var(--danger)] stroke-[var(--danger)]"/>
                ) : (
                    <HeartOff className="h-5 w-5 text-[var(--muted-500)]"/>
                )}
            </button>

            <Link
                href={`/resumes/${r.source}/${r.externalId}`}
                className="block focus:outline-none"
            >
                <h3 className="text-lg font-semibold text-[var(--fg)]">
                    {r.firstName} {r.lastName}
                </h3>
                <p className="text-sm text-[var(--muted-600)]">{r.position}</p>

                {r.salary && (
                    <Badge
                        variant="flat"
                        color="primary"
                        className="mt-2 rounded-full px-2 py-1"
                    >
                        {r.salary} {r.currency}
                    </Badge>
                )}

                <p className="text-xs text-[var(--muted-600)] mt-1">
                    Опыт: {r.experienceMonths} мес. •{" "}
                    {new Date(r.updatedAt).toLocaleDateString("ru-RU")}
                </p>
            </Link>
        </Card>
    );
}
