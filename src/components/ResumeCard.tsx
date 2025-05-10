"use client";

import { Card, Badge } from "@heroui/react";
import { Heart, HeartOff } from "lucide-react";
import { Resume } from "@/api/model";
import { useResumeFavourites } from "@/hooks/useFavourites";

export default function ResumeCard({ r }: { r: Resume }) {
    const { data: favs = [], toggle } = useResumeFavourites();
    const liked = favs.some(
        (f) => f.source === r.source && f.externalId === r.externalId
    );

    // Формируем дату обновления
    const updated = new Date(r.updatedAt).toLocaleDateString("ru-RU");

    return (
        <Card
            as="a"
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`
        p-4 relative
        bg-[var(--bg)]
        rounded-lg
        shadow
        hover:shadow-lg
        hover:ring-1 hover:ring-[var(--primary)]
        focus:outline-none focus:ring-0
        transition
        block
        no-underline
      `}
        >
            {/* Кнопка «лайк» */}
            <button
                className="absolute top-3 right-3"
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    toggle.mutate(r);
                }}
            >
                {liked ? (
                    <Heart className="h-5 w-5 fill-[var(--danger)] stroke-[var(--danger)]" />
                ) : (
                    <HeartOff className="h-5 w-5 text-[var(--muted-500)]" />
                )}
            </button>

            {/* Основной контент карточки */}
            <h3 className="text-lg font-semibold text-[var(--fg)]">
                {r.firstName} {r.lastName}
            </h3>
            <p className="text-sm text-[var(--muted-600)]">{r.position}</p>

            {/* Зарплата */}
            {r.salary != null && (
                <Badge
                    variant="flat"
                    color="primary"
                    className="mt-2 rounded-full px-2 py-1"
                >
                    {r.salary} {r.currency}
                </Badge>
            )}

            {/* Доп. информация */}
            <div className="mt-2 text-xs text-[var(--muted-600)] space-y-1">
                <div>
                    Возраст: {r.age != null ? `${r.age} лет` : "—"} • Пол:{" "}
                    {r.gender ?? "—"}
                </div>
                <div>Город: {r.city}</div>
                <div>Образование: {r.educationLevel ?? "—"}</div>
                <div>Опыт: {r.experienceMonths} мес.</div>
                <div>Обновлено: {updated}</div>
            </div>

            {/* Краткий список предыдущих мест работы */}
            {r.experience?.length > 0 && (
                <div className="mt-3 text-sm">
                    <div className="font-medium mb-1">Опыт работы:</div>
                    <ul className="list-disc list-inside space-y-1">
                        {r.experience.slice(0, 3).map((e, i) => (
                            <li key={i}>
                                <span className="font-semibold">{e.company}</span>, {e.position}
                            </li>
                        ))}
                        {r.experience.length > 3 && (
                            <li>…ещё {r.experience.length - 3} записи</li>
                        )}
                    </ul>
                </div>
            )}
        </Card>
    );
}
