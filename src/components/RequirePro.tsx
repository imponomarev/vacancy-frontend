"use client";
import { ReactNode, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import PaymentWidget from "@/components/PaymentWidget";

export default function RequirePro({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession();
    const [pro, setPro] = useState(false);

    useEffect(() => {
        // бэкенд кладёт role=PRO в claim "role"
        if (session?.user?.role === "PRO") setPro(true);
    }, [session]);

    // загрузка сессии
    if (status === "loading") return null;

    // если не pro
    if (!pro) {
        return (
            <div className="max-w-lg mx-auto py-10">
                <p className="text-lg mb-4 text-center">
                    Поиск резюме доступен только пользователям Pro.
                </p>
                <PaymentWidget onSuccess={() => setPro(true)} />
            </div>
        );
    }

    return <>{children}</>;
}
