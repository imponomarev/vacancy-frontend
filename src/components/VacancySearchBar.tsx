"use client";

import { useRouter } from "next/navigation";
import { Input, Button } from "@heroui/react";
import { useState, useEffect } from "react";
import { z } from "zod";
import { SearchExperience as SearchExperienceEnum } from "@/api/model";
import type { SearchExperience as SearchExperienceType } from "@/api/model";

const schema = z
    .object({
        text: z.string().min(2, "Введите хотя бы 2 символа в ключевые слова"),
        area: z.string().min(2, "Укажите город"),
        providers: z
            .array(z.enum(["hh", "sj", "avito"]))
            .optional()
            .default([]),
        salaryFrom: z
            .string()
            .optional()
            .transform((val) => (val?.trim() ? Number(val.trim()) : undefined))
            .refine((v) => v === undefined || v >= 0, "Нижняя граница зарплаты ≥ 0")
            .optional(),
        salaryTo: z
            .string()
            .optional()
            .transform((val) => (val?.trim() ? Number(val.trim()) : undefined))
            .refine((v) => v === undefined || v >= 0, "Верхняя граница зарплаты ≥ 0")
            .optional(),
        experience: z.nativeEnum(SearchExperienceEnum).optional(),
    })

const EXPERIENCE_OPTIONS: { label: string; value: SearchExperienceType }[] = [
    { label: "Без опыта", value: SearchExperienceEnum.NO_EXPERIENCE },
    { label: "1–3 года", value: SearchExperienceEnum.BETWEEN_1_AND_3 },
    { label: "3–6 лет", value: SearchExperienceEnum.BETWEEN_3_AND_6 },
    { label: "Более 6 лет", value: SearchExperienceEnum.MORE_THAN_6 },
];

const PROVIDER_OPTIONS = [
    { label: "hh", value: "hh" },
    { label: "Superjob", value: "sj" },
    { label: "Авито Работа", value: "avito" },
];

export default function VacancySearchBar() {
    const router = useRouter();

    const [text, setText] = useState("");
    const [area, setArea] = useState("");
    const [providers, setProviders] = useState<string[]>([]);
    const [salaryFrom, setSalaryFrom] = useState("");
    const [salaryTo, setSalaryTo] = useState("");
    const [experience, setExperience] = useState<SearchExperienceType | "">("");
    const [error, setError] = useState<string | null>(null);

    // Сбрасываем ошибку при любом изменении
    useEffect(() => {
        if (error) setError(null);
    }, [text, area, providers, salaryFrom, salaryTo, experience]);

    const onProviderChange = (val: string, checked: boolean) => {
        setProviders((prev) =>
            checked ? [...prev, val] : prev.filter((p) => p !== val)
        );
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const parsed = schema.safeParse({
            text: text.trim(),
            area: area.trim(),
            providers,
            salaryFrom,
            salaryTo,
            experience: experience || undefined,
        });
        if (!parsed.success) {
            setError(parsed.error.issues[0].message);
            return;
        }

        const params = new URLSearchParams({
            text: text.trim(),
            area: area.trim(),
            page: "0",
            perPage: "20",
        });

        // Ключ — просто "providers", без []
        if (providers.length > 0) {
            providers.forEach((p) => params.append("providers", p));
        }
        if (salaryFrom.trim()) params.set("salaryFrom", salaryFrom.trim());
        if (salaryTo.trim()) params.set("salaryTo", salaryTo.trim());
        if (experience) params.set("experience", experience.trim());

        setError(null);
        router.push(`/vacancies?${params.toString()}`);
    };

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                    placeholder="Ключевые слова"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <Input
                    placeholder="Город"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                />
                <fieldset className="space-y-1">
                    <legend className="font-medium">Провайдеры</legend>
                    {PROVIDER_OPTIONS.map((opt) => (
                        <label
                            key={opt.value}
                            className="inline-flex items-center gap-2"
                        >
                            <input
                                type="checkbox"
                                className="form-checkbox"
                                checked={providers.includes(opt.value)}
                                onChange={(e) =>
                                    onProviderChange(opt.value, e.target.checked)
                                }
                            />
                            {opt.label}
                        </label>
                    ))}
                </fieldset>
                <Input
                    placeholder="Зарплата от"
                    type="number"
                    value={salaryFrom}
                    onChange={(e) => setSalaryFrom(e.target.value)}
                />
                <Input
                    placeholder="Зарплата до"
                    type="number"
                    value={salaryTo}
                    onChange={(e) => setSalaryTo(e.target.value)}
                />
                <select
                    value={experience}
                    onChange={(e) =>
                        setExperience(e.target.value as SearchExperienceType)
                    }
                    className="p-2 border rounded"
                >
                    <option value="">Опыт</option>
                    {EXPERIENCE_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>
            </div>

            {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <div className="text-right">
                <Button type="submit">Искать вакансии</Button>
            </div>
        </form>
    );
}
