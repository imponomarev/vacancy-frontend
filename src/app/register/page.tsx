"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Input, Button } from "@heroui/react";
import { apiClient } from "@/lib/axios";
import { AuthFormWrapper } from "@/components/AuthFormWrapper";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [error, setError] = useState("");

    async function handle() {
        try {
            await apiClient.post("/auth/register", null, {
                params: { email, pwd },
            });
            await signIn("credentials", {
                email,
                password: pwd,
                callbackUrl: "/vacancies",
            });
        } catch {
            setError("Регистрация не удалась");
        }
    }

    const wrapperClasses = [
        "w-full",
        "border",
        "border-slate-300",
        "dark:border-slate-600",
        "rounded-md",
        "focus-within:ring-1",
        "focus-within:ring-primary",
        "focus-within:border-primary",
    ].join(" ");

    const innerInputClasses = [
        "w-full",
        "bg-transparent",
        "px-3",
        "py-2",
        "outline-none",
    ].join(" ");

    return (
        <AuthFormWrapper
            title="Создать аккаунт"
            bottomText={{
                text: "Уже есть аккаунт?",
                href: "/login",
                linkText: "Войти",
            }}
        >
            <div className="space-y-4">
                <div className={wrapperClasses}>
                    <Input
                        variant="unstyled"
                        inputClassName={innerInputClasses}
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className={wrapperClasses}>
                    <Input
                        variant="unstyled"
                        inputClassName={innerInputClasses}
                        placeholder="Пароль"
                        type="password"
                        value={pwd}
                        onChange={(e) => setPwd(e.target.value)}
                    />
                </div>
                <Button
                    onClick={handle}
                    size="lg"
                    variant="solid"
                    className="w-full text-base font-semibold"
                >
                    Зарегистрироваться
                </Button>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            </div>
        </AuthFormWrapper>
    );
}
