"use client";
/* global YooMoneyCheckoutWidget */
import {useEffect} from "react";

declare const YooMoneyCheckoutWidget: any;

export default function PaymentWidget({
                                          onSuccess,
                                      }: {
    onSuccess: () => void;
}) {
    useEffect(() => {
        const widget = new YooMoneyCheckoutWidget({
            confirmation_token: "FETCHED_FROM_BACKEND", // TODO: заменить на real
            return_url: window.location.href,
            error_callback: () => alert("Ошибка оплаты"),
            success_callback: () => {
                widget.destroy();
                onSuccess();
            },
        });
        widget.render("yoo-container");
    }, [onSuccess]);

    return <div id="yoo-container" className="w-full h-[600px]"/>;
}
