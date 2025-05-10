"use client";

import { usePathname, useRouter } from "next/navigation";
import { Input, Button } from "@heroui/react";
import { useState, useEffect } from "react";
import { z } from "zod";

import {
    Search1Experience as ExpEnum,
    Search1Schedule   as SchEnum,
    Search1Education  as EduEnum,
} from "@/api/model";

type Exp = keyof typeof ExpEnum;
type Sch = keyof typeof SchEnum;
type Edu = keyof typeof EduEnum;

const EXP = [
    { label: "Без опыта",     value: "NO_EXPERIENCE" },
    { label: "1–3 года",      value: "BETWEEN_1_AND_3_YEARS" },
    { label: "3–6 лет",       value: "BETWEEN_3_AND_6_YEARS" },
    { label: "Более 6 лет",   value: "MORE_THAN_6_YEARS" },
];
const SCH = [
    { label: "Полный день",         value: "FULL_DAY" },
    { label: "Сменный график",      value: "SHIFT" },
    { label: "Гибкий график",       value: "FLEXIBLE" },
    { label: "Удалённая работа",    value: "REMOTE" },
    { label: "Вахтовый метод",      value: "FLY_IN_FLY_OUT" },
    { label: "Частичная занятость", value: "PARTIAL_DAY" },
];
const EDU = [
    { label: "Среднее",            value: "SECONDARY" },
    { label: "Сред. спец.",        value: "SPECIAL_SECONDARY" },
    { label: "Неполное высшее",    value: "UNFINISHED_HIGHER" },
    { label: "Высшее",             value: "HIGHER" },
    { label: "Бакалавр",           value: "BACHELOR" },
    { label: "Магистр",            value: "MASTER" },
];
const PROV = [
    { label: "hh",       value: "hh" },
    { label: "SuperJob", value: "sj" },
    { label: "Avito",    value: "avito" },
];

const base = z.object({
    text: z.string().min(2),
    area: z.string().min(2),
});

export default function ResumeSearchBar() {
    const router   = useRouter();
    const pathname = usePathname();

    const [text, setText]       = useState("");
    const [area, setArea]       = useState("");
    const [prov, setProv]       = useState<string[]>([]);
    const [salaryFrom, setSF]   = useState("");
    const [salaryTo, setST]     = useState("");
    const [ageFrom, setAF]      = useState("");
    const [ageTo, setAT]        = useState("");
    const [exp, setExp]         = useState<Exp | "">("");
    const [sch, setSch]         = useState<Sch | "">("");
    const [edu, setEdu]         = useState<Edu | "">("");
    const [err, setErr]         = useState<string | null>(null);

    // Сбрасываем всё при смене пути
    useEffect(() => {
        setText("");
        setArea("");
        setProv([]);
        setSF("");
        setST("");
        setAF("");
        setAT("");
        setExp("");
        setSch("");
        setEdu("");
        setErr(null);
    }, [pathname]);

    // Сбрасываем ошибку при изменении любых полей
    useEffect(() => {
        if (err) setErr(null);
    }, [text, area, prov, salaryFrom, salaryTo, ageFrom, ageTo, exp, sch, edu]);

    const toggleProv = (v: string, on: boolean) =>
        setProv(p => (on ? [...p, v] : p.filter(x => x !== v)));

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!base.safeParse({ text, area }).success) {
            setErr("Заполните «Ключевые слова» и «Город» (≥ 2 симв.)");
            return;
        }
        const q = new URLSearchParams({
            text: text.trim(),
            area: area.trim(),
            page: "0",
            perPage: "20",
        });
        prov.forEach(p => q.append("providers", p));
        if (salaryFrom) q.set("salaryFrom", salaryFrom);
        if (salaryTo)   q.set("salaryTo",   salaryTo);
        if (ageFrom)    q.set("ageFrom",    ageFrom);
        if (ageTo)      q.set("ageTo",      ageTo);
        if (exp)        q.set("experience", exp);
        if (sch)        q.set("schedule",   sch);
        if (edu)        q.set("education",  edu);

        router.push(`/resumes?${q.toString()}`);
    };

    // контейнер поля
    const fieldWrapper = `
    w-full
    border border-[var(--muted-300)] dark:border-[var(--muted-600)]
    rounded-md
    focus-within:ring-1 focus-within:ring-[var(--primary)]
    focus-within:border-[var(--primary)]
    transition
  `.trim();

    // само нативное <input> или <select>
    const fieldInner = `
    w-full bg-transparent px-3 py-2 outline-none
  `.trim();

    return (
        <div className="rounded-lg bg-[var(--muted-100)] dark:bg-[var(--muted-800)] shadow-md p-6">
            <form onSubmit={submit} className="space-y-6">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {/* INPUT-поля */}
                    {[
                        { label: "Ключевые слова", value: text, onChange: setText },
                        { label: "Город",           value: area, onChange: setArea },
                        { label: "Зарплата от",     value: salaryFrom, onChange: setSF, type: "number" },
                        { label: "Зарплата до",     value: salaryTo,   onChange: setST, type: "number" },
                        { label: "Возраст от",      value: ageFrom,    onChange: setAF, type: "number" },
                        { label: "Возраст до",      value: ageTo,      onChange: setAT, type: "number" },
                    ].map(({ label, value, onChange, type }) => (
                        <div key={label} className="flex flex-col gap-1">
                            <label className="text-sm font-medium">{label}</label>
                            <div className={fieldWrapper}>
                                <Input
                                    variant="unstyled"
                                    inputClassName={fieldInner}
                                    placeholder={label}
                                    type={type as any}
                                    value={value}
                                    onChange={e => onChange(e.target.value)}
                                />
                            </div>
                        </div>
                    ))}

                    {/* ПРОВАЙДЕРЫ */}
                    <fieldset className="flex flex-col justify-center lg:col-span-2">
                        <legend className="text-sm font-medium mb-2">Провайдеры</legend>
                        <div className="flex flex-wrap gap-4">
                            {PROV.map(p => (
                                <label key={p.value} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={prov.includes(p.value)}
                                        onChange={e => toggleProv(p.value, e.target.checked)}
                                        className="form-checkbox h-5 w-5 accent-[var(--primary)]"
                                    />
                                    <span className="text-[var(--fg)]">{p.label}</span>
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    {/* SELECT-поля */}
                    {[
                        { label: "Опыт",       value: exp, setValue: setExp, options: EXP },
                        { label: "График",     value: sch, setValue: setSch, options: SCH },
                        { label: "Образование", value: edu, setValue: setEdu, options: EDU },
                    ].map(({ label, value, setValue, options }) => (
                        <div key={label} className="flex flex-col gap-1">
                            <label className="text-sm font-medium">{label}</label>
                            <div className={fieldWrapper}>
                                <select
                                    className={fieldInner}
                                    value={value}
                                    onChange={e => setValue(e.target.value as any)}
                                >
                                    <option value="">Не важно</option>
                                    {options.map(o => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))}

                    {/* КНОПКА */}
                    <div className="flex items-end lg:justify-end">
                        <Button
                            type="submit"
                            size="lg"
                            variant="solid"
                            className="
                bg-[var(--primary)] hover:bg-[var(--primary-light)]
                text-white
                rounded-md px-6 py-2
                transition
              "
                        >
                            Искать резюме
                        </Button>
                    </div>
                </div>

                {err && <p className="text-[var(--danger)] text-sm">{err}</p>}
            </form>
        </div>
    );
}
