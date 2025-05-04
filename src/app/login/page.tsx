"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Input, Button } from "@heroui/react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");

    async function handle() {
        const res = await signIn("credentials", {
            email, password: pwd, redirect: false
        });
        if (res?.error) alert("Ошибка логина"); else window.location.href = "/";
    }

    return (
        <div className="max-w-sm mx-auto py-10 flex flex-col gap-4">
            <Input placeholder="E‑mail" value={email} onChange={e=>setEmail(e.target.value)} />
            <Input placeholder="Пароль" type="password" value={pwd} onChange={e=>setPwd(e.target.value)} />
            <Button onClick={handle}>Войти</Button>
        </div>
    );
}
