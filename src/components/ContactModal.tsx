"use client";
import {Modal, Button} from "@heroui/react";
import {useState} from "react";
import PaymentWidget from "./PaymentWidget";

export default function ContactModal({contacts}: { contacts?: string }) {
    const [open, setOpen] = useState(false);
    const [paid, setPaid] = useState(false);

    return (
        <>
            <Button onClick={() => setOpen(true)}>Показать контакты</Button>
            <Modal open={open} onOpenChange={setOpen}>
                {paid ? (
                    <div className="p-6">
                        <p className="text-lg font-semibold">Контакты кандидата:</p>
                        <pre className="mt-4">{contacts}</pre>
                    </div>
                ) : (
                    <PaymentWidget onSuccess={() => setPaid(true)}/>
                )}
            </Modal>
        </>
    );
}
