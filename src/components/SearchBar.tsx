"use client";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {Input, Button} from "@heroui/react";
import {useState} from "react";
import {z} from "zod";

const schema = z
    .object({
        text: z.string().min(2, "Введите хотя бы 2 символа"),
        area: z.string().min(2, "Укажите город"),
    })
    .required();

export default function SearchBar() {
    const router      = useRouter();
    const pathname    = usePathname();          // ← где мы сейчас
    const qs          = useSearchParams();

    const [text,  setText]  = useState(qs.get("text")  ?? "");
    const [area,  setArea]  = useState(qs.get("area")  ?? "");

    /** определяем целевой ресурс по URL:
     *   /vacancies → vacancies
     *   /resumes   → resumes
     *   fallback   → vacancies            */
    const target =
        pathname.includes("/resumes") ? "resumes" : "vacancies";

    const onSubmit = () => {
        const parsed = schema.safeParse({ text, area });
        if (!parsed.success) return alert(parsed.error.issues[0].message);

        router.push(`/${target}?text=${text}&area=${area}&page=0&perPage=20`);
    };

    return (
        <div className="flex flex-col gap-2 sm:flex-row">
            <Input placeholder="Ключевые слова"
                   value={text} onChange={e => setText(e.target.value)} />
            <Input placeholder="Город"
                   value={area} onChange={e => setArea(e.target.value)} />
            <Button onClick={onSubmit}>Искать</Button>
        </div>
    );
}
