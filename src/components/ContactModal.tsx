"use client";

import React from "react";
import { Modal, Button } from "@heroui/react";
import BuyProButton from "./BuyProButton";

export default function ContactModal({ contacts }: { contacts?: string }) {
    const [open, setOpen] = React.useState(false);
    const [paid, setPaid] = React.useState(false);

    return (
        <>
            <Button onClick={() => setOpen(true)}>Показать контакты</Button>
            <Modal open={open} onOpenChange={setOpen}>
                {paid ? (
                    <div className="p-6">
                        <p className="text-lg font-semibold">Контакты кандидата:</p>
                        <pre className="mt-4 break-words">{contacts}</pre>
                    </div>
                ) : (
                    <div className="p-6 text-center">
                        <p className="mb-4">Платный просмотр контактов</p>
                        <BuyProButton onSuccess={() => setPaid(true)} />
                    </div>
                )}
            </Modal>
        </>
    );
}
