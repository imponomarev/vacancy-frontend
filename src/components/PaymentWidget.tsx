"use client";
/* global YooMoneyCheckoutWidget */
import { useEffect } from "react";

export default function PaymentWidget({ onSuccess }: { onSuccess: () => void }) {
    useEffect(() => {
        // если глобальной переменной нет, добавляем <script>
        if (typeof window !== "undefined" && !window.YooMoneyCheckoutWidget) {
            const s = document.createElement("script");
            s.src = "https://yookassa.ru/checkout-widget/v1/checkout-widget.js";
            s.onload = createWidget;
            document.body.appendChild(s);
        } else {
            createWidget();
        }

        function createWidget() {
            /* @ts-ignore — после подгрузки тип появится */
            const widget = new YooMoneyCheckoutWidget({
                confirmation_token: "FETCHED_FROM_BACKEND",
                return_url: window.location.href,
                error_callback: () => alert("Ошибка оплаты"),
                success_callback: () => {
                    widget.destroy();
                    onSuccess();
                },
            });
            widget.render("yoo-container");
        }
    }, [onSuccess]);

    return <div id="yoo-container" className="w-full h-[600px]" />;
}
