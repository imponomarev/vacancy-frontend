"use client";
import Link from "next/link";
import {Card, Badge} from "@heroui/react";
import {Heart, HeartOff} from "lucide-react";
import {Vacancy} from "@/api/model";
import {useVacancyFavourites} from "@/hooks/useFavourites";

export default function VacancyCard({v}: { v: Vacancy }) {
    /* --- избранное --- */
    const {data: favs = [], toggle} = useVacancyFavourites();
    const liked = favs.some(
        (f) => f.source === v.source && f.externalId === v.externalId
    );

    return (
        <Card className="p-4 relative hover:shadow-lg transition">
            {/* кнопка лайка */}
            <button
                className="absolute top-3 right-3"
                onClick={(e) => {
                    e.stopPropagation();
                    toggle.mutate(v);
                }}
            >
                {liked ? (
                    <Heart className="h-5 w-5 fill-red-500 stroke-red-500"/>
                ) : (
                    <HeartOff className="h-5 w-5 text-slate-400"/>
                )}
            </button>

            {/* основная информация */}
            <Link
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
            >
                <h3 className="text-lg font-semibold">{v.title}</h3>
                <p className="text-sm text-slate-500">{v.company}</p>

                {v.salaryFrom ? (
                    <Badge className="mt-2">
                        {v.salaryFrom}‑{v.salaryTo ?? "…"} {v.currency}
                    </Badge>
                ) : (
                    <Badge className="mt-2">ЗП не указана</Badge>
                )}

                {v.publishedAt && (
                    <p className="text-xs text-slate-400 mt-1">
                        Опубликовано:{" "}
                        {new Date(v.publishedAt).toLocaleDateString("ru-RU")}
                    </p>
                )}

                {v.description && (
                    <p className="text-sm line-clamp-3 mt-2 text-ellipsis overflow-hidden">
                        {v.description}
                    </p>
                )}

                {v.experienceReq && (
                    <p className="text-xs text-slate-500 mt-1">Опыт: {v.experienceReq}</p>
                )}

                <p className="text-xs text-slate-500">
                    График: {v.schedule ?? "не указан"} • Тип: {v.employmentType ?? "не указан"}
                </p>
            </Link>
        </Card>
    );
}
