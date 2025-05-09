"use client";

import React from "react";
import {Button} from "@heroui/react";
import {apiClient} from "@/lib/axios";
import YooWidget, {
    YooMoneyCheckoutWidgetConfig,
} from "react-yoomoneycheckoutwidget";

interface BuyProButtonProps {
    onSuccess?: () => void;
}

export default function BuyProButton({onSuccess}: BuyProButtonProps) {
    const [token, setToken] = React.useState<string | null>(null);

    async function handleBuy() {
        try {
            const resp = await apiClient.post<string>("/payments/pro");
            const t = resp.data;
            if (t.startsWith("http")) {
                window.location.href = t;
            } else {
                setToken(t);
            }
        } catch (err: any) {
            if (err.response?.status === 401) {
                setToken("invalid");
            } else {
                alert(err.response?.data?.message || err.message);
            }
        }
    }

    function handleComplete() {
        onSuccess ? onSuccess() : window.location.replace("/vacancies");
    }

    function handleClose() {
        setToken(null);
    }

    if (token) {
        const config: YooMoneyCheckoutWidgetConfig = {
            confirmation_token: token,
            customization: {modal: true},
            success_callback: handleComplete,
            // убрали console.error, чтобы не было {} в логах
            error_callback: () => {
            },
        };
        return <YooWidget config={config} onModalClose={handleClose}/>;
    }

    return (
        <Button
            variant="solid"
            className="
      bg-[var(--primary)] hover:bg-[var(--primary-dark)]
    text-white hover:text-white
    rounded-md px-4 py-2 transition
    "
            onClick={handleBuy}
        >
            Купить PRO
        </Button>
    );

}
