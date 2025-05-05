"use client";
import {useState} from "react";
import {signIn} from "next-auth/react";
import {Input, Button} from "@heroui/react";
import {apiClient} from "@/lib/axios";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [err, setErr] = useState("");

    async function handle() {
        try {
            await apiClient.post("/auth/register", null, {params: {email, pwd}});
            // сразу логиним
            await signIn("credentials", {email, password: pwd, callbackUrl: "/vacancies"});
        } catch {
            setErr("Регистрация не удалась");
        }
    }

    return (
        <div className="max-w-sm mx-auto py-10 flex flex-col gap-4">
            <Input placeholder="E‑mail" value={email} onChange={e => setEmail(e.target.value)}/>
            <Input placeholder="Пароль" type="password" value={pwd} onChange={e => setPwd(e.target.value)}/>
            <Button onClick={handle}>Зарегистрироваться</Button>
            {err && <p className="text-red-500 text-sm">{err}</p>}
        </div>
    );
}
