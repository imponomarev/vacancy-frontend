"use client";

import {useState} from "react";
import {Button} from "@heroui/react";
import {apiClient} from "@/lib/axios";
import PaymentWidget from "./PaymentWidget";

export default function BuyProButton() {
    const [confirmationToken, setConfirmationToken] = useState<string | null>(null);

    async function handleBuyPro() {
        try {
            const resp = await apiClient.post<string>("/payments/pro");
            const tokenOrUrl = resp.data;

            if (tokenOrUrl.startsWith("http")) {
                window.location.href = tokenOrUrl;
            } else {
                setConfirmationToken(tokenOrUrl);
            }
        } catch (error: any) {
            alert(error.response?.data?.message || error.message);
        }
    }

    return confirmationToken
        ? <PaymentWidget confirmationToken={confirmationToken}/>
        : <Button onClick={handleBuyPro}>Купить PRO</Button>;
}
