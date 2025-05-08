"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { Skeleton } from "@heroui/react";
import BuyProButton from "@/components/BuyProButton";

export default function ProBillingPage() {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") {
            signIn(undefined, { callbackUrl: "/login" });
        }
    }, [status]);

    if (status === "loading" || status === "unauthenticated") {
        return <Skeleton className="h-32 w-full" />;
    }
    if (session.user.role === "PRO") {
        return (
            <div className="max-w-lg mx-auto py-10 text-center">
                <h1 className="text-2xl font-bold mb-4">Вы уже PRO</h1>
            </div>
        );
    }
    return (
        <div className="max-w-lg mx-auto py-10 text-center">
            <h1 className="text-2xl font-bold mb-4">Оформить PRO-подписку</h1>
            <p className="mb-6">PRO-аккаунт даёт доступ к расширенному поиску резюме.</p>
            <BuyProButton />
        </div>
    );
}
