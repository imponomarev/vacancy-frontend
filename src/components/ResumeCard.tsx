"use client";
import Link from "next/link";
import {Card, Badge} from "@heroui/react";
import {Heart, HeartOff} from "lucide-react";
import {Resume} from "@/api/model";
import {useResumeFavourites} from "@/hooks/useFavourites";

export default function ResumeCard({r}: { r: Resume }) {
    /* --- избранное --- */
    const {data: favs = [], toggle} = useResumeFavourites();
    const liked = favs.some(
        (f) => f.source === r.source && f.externalId === r.externalId
    );

    return (
        <Card className="p-4 relative hover:shadow-lg transition">
            {/* лайк */}
            <button
                className="absolute top-3 right-3"
                onClick={(e) => {
                    e.stopPropagation();
                    toggle.mutate(r);
                }}
            >
                {liked ? (
                    <Heart className="h-5 w-5 fill-red-500 stroke-red-500"/>
                ) : (
                    <HeartOff className="h-5 w-5 text-slate-400"/>
                )}
            </button>

            {/* ссылка на детальную страницу */}
            <Link href={`/resumes/${r.source}/${r.externalId}`} className="block">
                <h3 className="text-lg font-semibold">
                    {r.firstName} {r.lastName}
                </h3>
                <p className="text-sm text-slate-500">{r.position}</p>

                {r.salary && (
                    <Badge className="mt-2">
                        {r.salary} {r.currency}
                    </Badge>
                )}

                <p className="text-xs text-slate-400 mt-1">
                    Опыт: {r.experienceMonths} мес. •&nbsp;
                    {new Date(r.updatedAt).toLocaleDateString("ru-RU")}
                </p>
            </Link>
        </Card>
    );
}
