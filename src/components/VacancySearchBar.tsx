"use client";

import { usePathname, useRouter } from "next/navigation";
import { Input, Button } from "@heroui/react";
import { useState, useEffect } from "react";
import { z } from "zod";
import type { SearchExperience as ExpType } from "@/api/model";

const EXP: { label: string; value: ExpType }[] = [
    { label: "Без опыта",   value: "NO_EXPERIENCE" },
    { label: "1–3 года",    value: "BETWEEN_1_AND_3" },
    { label: "3–6 лет",     value: "BETWEEN_3_AND_6" },
    { label: "Более 6 лет", value: "MORE_THAN_6" },
];

const PROV = [
    { label: "hh",       value: "hh" },
    { label: "SuperJob", value: "sj" },
    { label: "Авито",    value: "avito" },
];

const base = z.object({ text: z.string().min(2), area: z.string().min(2) });

export default function VacancySearchBar() {
    const router   = useRouter();
    const pathname = usePathname();

    const [text, setText]         = useState("");
    const [area, setArea]         = useState("");
    const [prov, setProv]         = useState<string[]>([]);
    const [salaryFrom, setSF]     = useState("");
    const [salaryTo, setST]       = useState("");
    const [experience, setExp]    = useState<ExpType | "">("");
    const [err, setErr]           = useState<string | null>(null);

    // Сбрасываем всё при смене пути
    useEffect(() => {
        setText("");
        setArea("");
        setProv([]);
        setSF("");
        setST("");
        setExp("");
        setErr(null);
    }, [pathname]);

    // Сбрасываем ошибку при изменении любых полей
    useEffect(() => {
        if (err) setErr(null);
    }, [text, area, salaryFrom, salaryTo, experience, prov]);

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
        if (salaryFrom)   q.set("salaryFrom", salaryFrom);
        if (salaryTo)     q.set("salaryTo",   salaryTo);
        if (experience)   q.set("experience", experience);

        router.push(`/vacancies?${q.toString()}`);
    };

    const inputWrapper = `
    w-full
    border border-[var(--muted-300)] dark:border-[var(--muted-600)]
    rounded-md
    focus-within:ring-1 focus-within:ring-[var(--primary)]
    focus-within:border-[var(--primary)]
    transition
  `.trim();

    const inputInner = `
    w-full bg-transparent px-3 py-2 outline-none
  `.trim();

    return (
        <div className="rounded-lg bg-[var(--muted-100)] dark:bg-[var(--muted-800)] shadow-md p-6">
            <form onSubmit={submit} className="space-y-6">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {/* INPUT-поля */}
                    {[
                        { lbl: "Ключевые слова", val: text, set: setText },
                        { lbl: "Город",          val: area, set: setArea },
                        { lbl: "Зарплата от",    val: salaryFrom, set: setSF, type: "number" },
                        { lbl: "Зарплата до",    val: salaryTo,   set: setST, type: "number" },
                    ].map(({ lbl, val, set, type }) => (
                        <div key={lbl} className="flex flex-col gap-1">
                            <label className="text-sm font-medium">{lbl}</label>
                            <div className={inputWrapper}>
                                <Input
                                    variant="unstyled"
                                    inputClassName={inputInner}
                                    type={type as any}
                                    value={val}
                                    onChange={e => set(e.target.value)}
                                    placeholder={lbl}
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

                    {/* SELECT «Опыт» */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">Опыт</label>
                        <div className={inputWrapper}>
                            <select
                                value={experience}
                                onChange={e => setExp(e.target.value as ExpType)}
                                className={inputInner}
                            >
                                <option value="">Не важно</option>
                                {EXP.map(o => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Кнопка */}
                    <div className="flex items-end lg:justify-end">
                        <Button
                            type="submit"
                            size="lg"
                            variant="solid"
                            className="
                bg-[var(--primary)] hover:bg-[var(--primary-light)]
                text-white
                rounded-md
                px-6 py-2
                transition
              "
                        >
                            Искать вакансии
                        </Button>
                    </div>
                </div>

                {err && <p className="text-[var(--danger)] text-sm">{err}</p>}
            </form>
        </div>
    );
}
