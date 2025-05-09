"use client";

import { useRouter } from "next/navigation";
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
    { label: "Без опыта",   value: "NO_EXPERIENCE" },
    { label: "1–3 года",    value: "BETWEEN_1_AND_3_YEARS" },
    { label: "3–6 лет",     value: "BETWEEN_3_AND_6_YEARS" },
    { label: "Более 6 лет", value: "MORE_THAN_6_YEARS" },
];
const SCH = [
    { label: "Полный день",        value: "FULL_DAY" },
    { label: "Сменный график",     value: "SHIFT" },
    { label: "Гибкий график",      value: "FLEXIBLE" },
    { label: "Удалённая работа",   value: "REMOTE" },
    { label: "Вахтовый метод",     value: "FLY_IN_FLY_OUT" },
    { label: "Частичная занятость",value: "PARTIAL_DAY" },
];
const EDU = [
    { label: "Среднее",         value: "SECONDARY" },
    { label: "Сред. спец.",     value: "SPECIAL_SECONDARY" },
    { label: "Неполное высшее", value: "UNFINISHED_HIGHER" },
    { label: "Высшее",          value: "HIGHER" },
    { label: "Бакалавр",        value: "BACHELOR" },
    { label: "Магистр",         value: "MASTER" },
];
const PROV = [
    { label: "hh",       value: "hh" },
    { label: "SuperJob", value: "sj" },
    { label: "Avito",    value: "avito" },
];

const base = z.object({ text: z.string().min(2), area: z.string().min(2) });

export default function ResumeSearchBar() {
    const router = useRouter();

    const [text, setText]     = useState("");
    const [area, setArea]     = useState("");
    const [prov, setProv]     = useState<string[]>([]);
    const [salaryFrom, setSF] = useState("");
    const [salaryTo, setST]   = useState("");
    const [ageFrom, setAF]    = useState("");
    const [ageTo, setAT]      = useState("");
    const [exp, setExp]       = useState<Exp  | "">("");
    const [sch, setSch]       = useState<Sch  | "">("");
    const [edu, setEdu]       = useState<Edu  | "">("");
    const [err, setErr]       = useState<string | null>(null);

    useEffect(
        () => setErr(null),
        [text, area, prov, salaryFrom, salaryTo, ageFrom, ageTo, exp, sch, edu],
    );

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
        if (ageFrom)    q.set("ageFrom",    ageFrom);
        if (ageTo)      q.set("ageTo",      ageTo);
        if (exp)  q.set("experience", exp);
        if (sch)  q.set("schedule",   sch);
        if (edu)  q.set("education",  edu);

        router.push(`/resumes?${q.toString()}`);
    };

    return (
        <div className="rounded-lg bg-white/90 dark:bg-slate-800/80 shadow-md p-6">
            <form onSubmit={submit} className="space-y-6">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

                    {/* INPUT-поля */}
                    {[
                        { l: "Ключевые слова", v: text,      set: setText },
                        { l: "Город",          v: area,      set: setArea },
                        { l: "Зарплата от",    v: salaryFrom,set: setSF, type:"number" },
                        { l: "Зарплата до",    v: salaryTo,  set: setST, type:"number" },
                        { l: "Возраст от",     v: ageFrom,   set: setAF, type:"number" },
                        { l: "Возраст до",     v: ageTo,     set: setAT, type:"number" },
                    ].map(({ l, v, set, type }) => (
                        <div key={l} className="flex flex-col gap-1">
                            <label className="text-sm font-medium">{l}</label>
                            <Input
                                value={v}
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

                    {/* SELECT-поля */}
                    {[
                        { l: "Опыт",       v: exp, set: setExp, opts: EXP },
                        { l: "График",     v: sch, set: setSch, opts: SCH },
                        { l: "Образование",v: edu, set: setEdu, opts: EDU },
                    ].map(({ l, v, set, opts }) => (
                        <div key={l} className="flex flex-col gap-1">
                            <label className="text-sm font-medium">{l}</label>
                            <select
                                value={v}
                                onChange={(e) => set(e.target.value as any)}
                                className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 bg-white dark:bg-slate-800"
                            >
                                <option value="">Не важно</option>
                                {opts.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}

                    {/* КНОПКА */}
                    <div className="flex items-end lg:justify-end">
                        <Button
                            type="submit"
                            size="lg"
                            variant="outline"
                            className="min-w-[10rem] text-base font-semibold"
                        >
                            Искать резюме
                        </Button>
                    </div>
                </div>

                {err && <p className="text-red-500 text-sm">{err}</p>}
            </form>
        </div>
    );
}
