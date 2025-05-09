"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Input, Button } from "@heroui/react";
import { AuthFormWrapper } from "@/components/AuthFormWrapper";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [error, setError] = useState("");

    async function handle() {
        const res = await signIn("credentials", {
            email,
            password: pwd,
            redirect: false,
        });
        if (res?.error) {
            setError("Неверный логин или пароль");
        } else {
            window.location.href = "/vacancies";
        }
    }

    // класс контейнера с рамкой
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

    // класс самого <input> внутри
    const innerInputClasses = [
        "w-full",
        "bg-transparent",
        "px-3",
        "py-2",
        "outline-none",
    ].join(" ");

    return (
        <AuthFormWrapper
            title="Войти в аккаунт"
            bottomText={{
                text: "Ещё нет аккаунта?",
                href: "/register",
                linkText: "Зарегистрироваться",
            }}
        >
            <div className="space-y-4">
                {/* E-mail */}
                <div className={wrapperClasses}>
                    <Input
                        variant="unstyled"
                        inputClassName={innerInputClasses}
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                {/* Пароль */}
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
                    Войти
                </Button>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            </div>
        </AuthFormWrapper>
    );
}
