"use client";
import { ReactNode, useState } from "react";
import { useSession } from "next-auth/react";
import { Button, Modal } from "@heroui/react";
import PaymentWidget from "@/components/PaymentWidget";

export default function RequirePro({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession();
    const [open, setOpen] = useState(false);

    if (status === "loading") return null;
    if (session?.user.role === "PRO") return <>{children}</>;

    /* FREE user */
    return (
        <div className="max-w-lg mx-auto py-10 text-center">
            <p className="text-lg mb-4">Поиск резюме доступен только пользователям Pro.</p>

            <Button onClick={() => setOpen(true)}>Купить Pro</Button>

            <Modal open={open} onOpenChange={setOpen}>
                {/* simple stub until you have real confirmation_token */}
                <p className="p-6 text-center text-red-500">
                    Оплата пока не настроена<br /> (нужен confirmation_token от YooKassa)
                </p>
                {/* if token available -> <PaymentWidget …/> */}
            </Modal>
        </div>
    );
}
