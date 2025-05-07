"use client";

import { ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Props {
    children: ReactNode;
}

export default function RequirePro({ children }: Props) {
    const { data: session, status } = useSession();
    const router = useRouter();

    // пока ждём сессию — ничего не рендерим
    if (status === "loading") return null;

    // если FREE — отдаем редирект на /billing/pro
    if (status === "authenticated" && session?.user.role === "FREE") {
        useEffect(() => {
            router.replace("/billing/pro");
        }, [router]);
        return null;
    }

    // PRO или неавторизованный — рендерим детей
    return <>{children}</>;
}
