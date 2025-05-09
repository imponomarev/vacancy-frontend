"use client";

import {useRouter} from "next/navigation";
import {Input, Button} from "@heroui/react";
import {useState, useEffect} from "react";
import {z} from "zod";

import {
    Search1Experience as ResumeExperienceEnum,
    Search1Schedule as ResumeScheduleEnum,
    Search1Education as ResumeEducationEnum,
} from "@/api/model";

type ExperienceType = keyof typeof ResumeExperienceEnum;
type ScheduleType = keyof typeof ResumeScheduleEnum;
type EducationType = keyof typeof ResumeEducationEnum;

const schema = z
    .object({
        text: z.string().min(2, "Введите хотя бы 2 символа для ключевых слов"),
        area: z.string().min(2, "Укажите город"),
        providers: z.array(z.enum(["hh", "sj", "avito"])).optional().default([]),
        salaryFrom: z
            .string()
            .optional()
            .transform((v) => (v?.trim() ? Number(v) : undefined))
            .refine((v) => v === undefined || v >= 0, "Нижняя граница зарплаты ≥ 0")
            .optional(),
        salaryTo: z
            .string()
            .optional()
            .transform((v) => (v?.trim() ? Number(v) : undefined))
            .refine((v) => v === undefined || v >= 0, "Верхняя граница зарплаты ≥ 0")
            .optional(),
        ageFrom: z
            .string()
            .optional()
            .transform((v) => (v?.trim() ? Number(v) : undefined))
            .refine((v) => v === undefined || v >= 0, "Возраст от ≥ 0")
            .optional(),
        ageTo: z
            .string()
            .optional()
            .transform((v) => (v?.trim() ? Number(v) : undefined))
            .refine((v) => v === undefined || v >= 0, "Возраст до ≥ 0")
            .optional(),
        experience: z.nativeEnum(ResumeExperienceEnum).optional(),
        schedule: z.nativeEnum(ResumeScheduleEnum).optional(),
        education: z.nativeEnum(ResumeEducationEnum).optional(),
    })

const PROVIDER_OPTIONS = [
    {label: "HH", value: "hh"},
    {label: "SuperJob", value: "sj"},
    {label: "Avito", value: "avito"},
];

const EXPERIENCE_OPTIONS: { label: string; value: ExperienceType }[] = [
    {label: "Без опыта", value: "NO_EXPERIENCE"},
    {label: "1–3 года", value: "BETWEEN_1_AND_3_YEARS"},
    {label: "3–6 лет", value: "BETWEEN_3_AND_6_YEARS"},
    {label: "Более 6 лет", value: "MORE_THAN_6_YEARS"},
];

const SCHEDULE_OPTIONS: { label: string; value: ScheduleType }[] = [
    {label: "Полный день", value: "FULL_DAY"},
    {label: "Сменный график", value: "SHIFT"},
    {label: "Гибкий график", value: "FLEXIBLE"},
    {label: "Удалённая работа", value: "REMOTE"},
    {label: "Вахтовый метод", value: "FLY_IN_FLY_OUT"},
    {label: "Частичная занятость", value: "PARTIAL_DAY"},
];

const EDUCATION_OPTIONS: { label: string; value: EducationType }[] = [
    {label: "Среднее", value: "SECONDARY"},
    {label: "Среднее специальное", value: "SPECIAL_SECONDARY"},
    {label: "Неполное высшее", value: "UNFINISHED_HIGHER"},
    {label: "Высшее", value: "HIGHER"},
    {label: "Бакалавр", value: "BACHELOR"},
    {label: "Магистр", value: "MASTER"},
];

export default function ResumeSearchBar() {
    const router = useRouter();

    const [text, setText] = useState("");
    const [area, setArea] = useState("");
    const [providers, setProviders] = useState<string[]>([]);
    const [salaryFrom, setSalaryFrom] = useState("");
    const [salaryTo, setSalaryTo] = useState("");
    const [ageFrom, setAgeFrom] = useState("");
    const [ageTo, setAgeTo] = useState("");
    const [experience, setExperience] = useState<ExperienceType | "">("");
    const [schedule, setSchedule] = useState<ScheduleType | "">("");
    const [education, setEducation] = useState<EducationType | "">("");
    const [error, setError] = useState<string | null>(null);

    // Сбрасываем ошибку при любом изменении полей
    useEffect(() => {
        if (error) setError(null);
    }, [
        text, area, providers,
        salaryFrom, salaryTo,
        ageFrom, ageTo,
        experience, schedule, education
    ]);

    const toggleProvider = (val: string, checked: boolean) => {
        setProviders(prev =>
            checked ? [...prev, val] : prev.filter(p => p !== val)
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
            ageFrom,
            ageTo,
            experience: experience || undefined,
            schedule: schedule || undefined,
            education: education || undefined,
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
        providers.forEach(p => params.append("providers", p));
        if (salaryFrom) params.set("salaryFrom", salaryFrom);
        if (salaryTo) params.set("salaryTo", salaryTo);
        if (ageFrom) params.set("ageFrom", ageFrom);
        if (ageTo) params.set("ageTo", ageTo);
        if (experience) params.set("experience", experience);
        if (schedule) params.set("schedule", schedule);
        if (education) params.set("education", education);

        setError(null);
        router.push(`/resumes?${params.toString()}`);
    };

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                    placeholder="Ключевые слова"
                    value={text}
                    onChange={e => setText(e.target.value)}
                />
                <Input
                    placeholder="Город"
                    value={area}
                    onChange={e => setArea(e.target.value)}
                />

                {/* Провайдеры */}
                <fieldset className="space-y-1">
                    <legend className="font-medium">Провайдеры</legend>
                    {PROVIDER_OPTIONS.map(opt => (
                        <label key={opt.value} className="inline-flex items-center gap-2">
                            <input
                                type="checkbox"
                                className="form-checkbox"
                                checked={providers.includes(opt.value)}
                                onChange={e => toggleProvider(opt.value, e.target.checked)}
                            />
                            {opt.label}
                        </label>
                    ))}
                </fieldset>

                <Input
                    placeholder="Зарплата от"
                    type="number"
                    value={salaryFrom}
                    onChange={e => setSalaryFrom(e.target.value)}
                />
                <Input
                    placeholder="Зарплата до"
                    type="number"
                    value={salaryTo}
                    onChange={e => setSalaryTo(e.target.value)}
                />
                <Input
                    placeholder="Возраст от"
                    type="number"
                    value={ageFrom}
                    onChange={e => setAgeFrom(e.target.value)}
                />
                <Input
                    placeholder="Возраст до"
                    type="number"
                    value={ageTo}
                    onChange={e => setAgeTo(e.target.value)}
                />

                <select
                    value={experience}
                    onChange={e => setExperience(e.target.value as ExperienceType)}
                    className="p-2 border rounded"
                >
                    <option value="">Опыт</option>
                    {EXPERIENCE_OPTIONS.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>

                <select
                    value={schedule}
                    onChange={e => setSchedule(e.target.value as ScheduleType)}
                    className="p-2 border rounded"
                >
                    <option value="">График</option>
                    {SCHEDULE_OPTIONS.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>

                <select
                    value={education}
                    onChange={e => setEducation(e.target.value as EducationType)}
                    className="p-2 border rounded"
                >
                    <option value="">Образование</option>
                    {EDUCATION_OPTIONS.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>
            </div>

            {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <div className="text-right">
                <Button type="submit">Искать резюме</Button>
            </div>
        </form>
    );
}
