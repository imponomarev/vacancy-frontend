// ContactModal.tsx
"use client";
import React from "react";
import {Modal, Button} from "@heroui/react";
import BuyProButton from "./BuyProButton";

export default function ContactModal({contacts}: { contacts?: string }) {
    const [open, setOpen] = React.useState(false);
    const [paid, setPaid] = React.useState(false);

    return (
        <>
            <Button
                variant="solid"
                className="
          bg-[var(--secondary)] hover:bg-[var(--secondary-light)]
          text-white rounded-md px-4 py-2 transition
        "
                onClick={() => setOpen(true)}
            >
                Показать контакты
            </Button>

            <Modal open={open} onOpenChange={setOpen}>
                <div className="p-6 bg-[var(--bg)] rounded-lg">
                    {paid ? (
                        <>
                            <h2 className="text-xl font-semibold mb-4">
                                Контакты кандидата
                            </h2>
                            <pre className="whitespace-pre-wrap break-words">
                {contacts}
              </pre>
                        </>
                    ) : (
                        <div className="text-center space-y-4">
                            <p>Платный просмотр контактов</p>
                            <BuyProButton onSuccess={() => setPaid(true)}/>
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
}
