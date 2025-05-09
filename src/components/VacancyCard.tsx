"use client";
import Link from "next/link";
import {Card, Badge} from "@heroui/react";
import {Heart, HeartOff} from "lucide-react";
import {Vacancy} from "@/api/model";
import {useVacancyFavourites} from "@/hooks/useFavourites";

export default function VacancyCard({v}: { v: Vacancy }) {
    const {data: favs = [], toggle} = useVacancyFavourites();
    const liked = favs.some(
        (f) => f.source === v.source && f.externalId === v.externalId
    );

    return (
        <Card
            as="div"
            className={`
        p-4 relative
        bg-[var(--bg)]
        rounded-lg
        shadow
        hover:shadow-lg
        hover:ring-1 hover:ring-[var(--primary)]
        focus:outline-none focus:ring-0
        transition

        /* скрываем этот ненужный span-индикатор */
        [&>span]:hidden
      `}
        >
            <button
                className="absolute top-3 right-3"
                onClick={(e) => {
                    e.stopPropagation();
                    toggle.mutate(v);
                }}
            >
                {liked ? (
                    <Heart className="h-5 w-5 fill-[var(--danger)] stroke-[var(--danger)]"/>
                ) : (
                    <HeartOff className="h-5 w-5 text-[var(--muted-500)]"/>
                )}
            </button>

            <Link
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block focus:outline-none"
            >
                <h3 className="text-lg font-semibold text-[var(--fg)]">{v.title}</h3>
                <p className="text-sm text-[var(--muted-600)]">{v.company}</p>

                <Badge
                    variant="flat"
                    color="primary"
                    className="mt-2 px-2 py-1 rounded-full"
                >
                    {v.salaryFrom
                        ? `${v.salaryFrom}–${v.salaryTo ?? "…"} ${v.currency}`
                        : "ЗП не указана"}
                </Badge>

                {v.publishedAt && (
                    <p className="text-xs text-[var(--muted-600)] mt-1">
                        Опубликовано:{" "}
                        {new Date(v.publishedAt).toLocaleDateString("ru-RU")}
                    </p>
                )}

                {v.description && (
                    <p className="text-sm line-clamp-3 mt-2 text-[var(--muted-700)]">
                        {v.description}
                    </p>
                )}

                <p className="text-xs text-[var(--muted-600)] mt-1">
                    Опыт: {v.experienceReq ?? "не указан"} • График:{" "}
                    {v.schedule ?? "не указан"}
                </p>
            </Link>
        </Card>
    );
}
