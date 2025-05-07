"use client";

import { useSession } from "next-auth/react";
import { Skeleton } from "@heroui/react";
import BuyProButton from "@/components/BuyProButton";

export default function ProBillingPage() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <Skeleton className="h-32 w-full" />;
    }

    // Если уже Pro — просто сообщаем
    if (session?.user.role === "PRO") {
        return (
            <div className="max-w-lg mx-auto py-10 text-center">
                <h1 className="text-2xl font-bold mb-4">Вы уже являетесь пользователем Pro</h1>
            </div>
        );
    }

    // FREE — предлагаем купить
    return (
        <div className="max-w-lg mx-auto py-10 text-center">
            <h1 className="text-2xl font-bold mb-4">Оформить подписку Pro</h1>
            <p className="mb-6">
                Подписка Pro открывает поиск резюме и другие преимущества.
            </p>
            <BuyProButton />
        </div>
    );
}
