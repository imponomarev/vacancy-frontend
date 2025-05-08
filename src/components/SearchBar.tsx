"use client";

import { usePathname, useRouter } from "next/navigation";
import { Input, Button } from "@heroui/react";
import { useState, useEffect } from "react";
import { z } from "zod";

const schema = z
    .object({
        text: z.string().min(2, "Введите хотя бы 2 символа в ключевые слова"),
        area: z.string().min(2, "Укажите город"),
    })
    .required();

export default function SearchBar() {
    const router = useRouter();
    const pathname = usePathname();

    // Всегда начинаем с пустых полей
    const [text, setText] = useState("");
    const [area, setArea] = useState("");

    // Храним единое сообщение об ошибке
    const [error, setError] = useState<string | null>(null);

    // Определяем цель формы
    const target = pathname.includes("/resumes") ? "resumes" : "vacancies";

    // Очищаем поля и ошибки при каждом монтировании
    useEffect(() => {
        setText("");
        setArea("");
        setError(null);
    }, []);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const result = schema.safeParse({ text, area });

        if (!result.success) {
            // Берём только первое сообщение
            setError(result.error.issues[0].message);
            return;
        }

        setError(null);

        // Перенаправляем на поиск
        router.push(
            `/${target}` +
            `?text=${encodeURIComponent(text.trim())}` +
            `&area=${encodeURIComponent(area.trim())}` +
            `&page=0&perPage=20`
        );
    };

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-2">
            {/* Вся строка полей + кнопки */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="flex-1 min-w-[200px]">
                    <Input
                        placeholder="Ключевые слова"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>
                <div className="flex-1 min-w-[200px]">
                    <Input
                        placeholder="Город"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                    />
                </div>
                <Button type="submit" className="whitespace-nowrap">
                    Искать
                </Button>
            </div>

            {/* Общее сообщение об ошибке, не сдвигающее верх */}
            {error && (
                <p className="text-red-500 text-sm mt-1 text-center">
                    {error}
                </p>
            )}
        </form>
    );
}
