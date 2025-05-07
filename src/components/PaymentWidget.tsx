"use client";
/* global YooMoneyCheckoutWidget */
import { useEffect } from "react";

interface PaymentWidgetProps {
    confirmationToken: string;
    onSuccess?: () => void;
}

export default function PaymentWidget({
                                          confirmationToken,
                                          onSuccess,
                                      }: PaymentWidgetProps) {
    useEffect(() => {
        // Подгружаем скрипт виджета, если нужно
        if (typeof window !== "undefined" && !window.YooMoneyCheckoutWidget) {
            const s = document.createElement("script");
            s.src = "https://yookassa.ru/checkout-widget/v1/checkout-widget.js";
            s.onload = createWidget;
            document.body.appendChild(s);
        } else {
            createWidget();
        }

        function createWidget() {
            /* @ts-ignore */
            const widget = new YooMoneyCheckoutWidget({
                confirmation_token: confirmationToken,
                return_url: window.location.href,
                error_callback: () => alert("Ошибка оплаты"),
                success_callback: () => {
                    widget.destroy();
                    onSuccess?.();
                },
            });
            widget.render("yoo-container");
        }
    }, [confirmationToken, onSuccess]);

    return <div id="yoo-container" className="w-full h-[600px]" />;
}
