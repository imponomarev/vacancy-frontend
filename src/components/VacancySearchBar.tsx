"use client";

import { useRouter } from "next/navigation";
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
    const router = useRouter();

    const [text, setText]       = useState("");
    const [area, setArea]       = useState("");
    const [prov, setProv]       = useState<string[]>([]);
    const [salaryFrom, setSF]   = useState("");
    const [salaryTo,   setST]   = useState("");
    const [experience, setExp]  = useState<ExpType | "">("");
    const [err, setErr]         = useState<string | null>(null);

    useEffect(() => setErr(null), [text, area, salaryFrom, salaryTo, experience, prov]);

    const toggleProv = (v: string, on: boolean) =>
        setProv((p) => (on ? [...p, v] : p.filter((x) => x !== v)));

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
        prov.forEach((p) => q.append("providers", p));
        if (salaryFrom) q.set("salaryFrom", salaryFrom);
        if (salaryTo)   q.set("salaryTo",   salaryTo);
        if (experience) q.set("experience", experience);

        router.push(`/vacancies?${q.toString()}`);
    };

    return (
        <div className="rounded-lg bg-white/90 dark:bg-slate-800/80 shadow-md p-6">
            <form onSubmit={submit} className="space-y-6">
                {/* ─────────────── GRID ─────────────── */}
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {/* INPUT-поля */}
                    {[
                        { lbl: "Ключевые слова", val: text,   set: setText },
                        { lbl: "Город",          val: area,   set: setArea },
                        { lbl: "Зарплата от",    val: salaryFrom, set: setSF, type: "number" },
                        { lbl: "Зарплата до",    val: salaryTo,   set: setST, type: "number" },
                    ].map(({ lbl, val, set, type }) => (
                        <div key={lbl} className="flex flex-col gap-1 w-full">
                            <label className="text-sm font-medium">{lbl}</label>
                            <Input
                                value={val}
                                type={type as any}
                                onChange={(e) => set(e.target.value)}
                                className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                            />
                        </div>
                    ))}

                    {/* ПРОВАЙДЕРЫ */}
                    <fieldset className="flex flex-col justify-center lg:col-span-2">
                        <legend className="text-sm font-medium mb-2">Провайдеры</legend>
                        <div className="flex flex-wrap gap-x-8 gap-y-3">
                            {PROV.map((p) => (
                                <label key={p.value} className="flex items-center gap-2 text-base">
                                    <input
                                        type="checkbox"
                                        checked={prov.includes(p.value)}
                                        onChange={(e) => toggleProv(p.value, e.target.checked)}
                                        className="form-checkbox h-5 w-5 accent-primary"
                                    />
                                    {p.label}
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    {/* ОПЫТ */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">Опыт</label>
                        <select
                            value={experience}
                            onChange={(e) => setExp(e.target.value as ExpType)}
                            className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 bg-white dark:bg-slate-800"
                        >
                            <option value="">Не важно</option>
                            {EXP.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* КНОПКА */}
                    <div className="flex items-end lg:justify-end">
                        <Button
                            type="submit"
                            size="lg"
                            variant="outline"
                            className="min-w-[10rem] text-base font-semibold"
                        >
                            Искать вакансии
                        </Button>
                    </div>
                </div>

                {err && <p className="text-red-500 text-sm">{err}</p>}
            </form>
        </div>
    );
}
