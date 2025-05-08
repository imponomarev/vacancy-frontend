"use client";

import React from "react";
import { Button } from "@heroui/react";
import { apiClient } from "@/lib/axios";
import YooWidget, { YooMoneyCheckoutWidgetConfig } from "react-yoomoneycheckoutwidget";

interface BuyProButtonProps {
    /** Если передать onSuccess — вызовется вместо редиректа */
    onSuccess?: () => void;
}

export default function BuyProButton({ onSuccess }: BuyProButtonProps) {
    const [confirmationToken, setConfirmationToken] = React.useState<string | null>(null);

    async function handleBuyPro() {
        try {
            const resp = await apiClient.post<string>("/payments/pro");
            const tokOrUrl = resp.data;

            if (tokOrUrl.startsWith("http")) {
                window.location.href = tokOrUrl;
            } else {
                setConfirmationToken(tokOrUrl);
            }
        } catch (err: any) {
            if (err.response?.status === 401) {
                setConfirmationToken("invalid-token");
            } else {
                alert(err.response?.data?.message || err.message);
            }
        }
    }

    function handleComplete() {
        if (onSuccess) {
            onSuccess();
        } else {
            window.location.replace("/vacancies");
        }
    }

    function handleModalClose() {
        // просто возвращаем кнопку
        setConfirmationToken(null);
    }

    if (confirmationToken) {
        const config: YooMoneyCheckoutWidgetConfig = {
            confirmation_token: confirmationToken,
            customization: { modal: true },
            success_callback: handleComplete,
            error_callback: (err) => console.error("YooWidget error:", err),
        };

        return <YooWidget config={config} onModalClose={handleModalClose} />;
    }

    return <Button onClick={handleBuyPro}>Купить PRO</Button>;
}
