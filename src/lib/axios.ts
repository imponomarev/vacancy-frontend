import axios from "axios";
import { getServerSession } from "next-auth/next";
import { getSession } from "next-auth/react";
import { authOptions } from "@/lib/auth";

export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

apiClient.interceptors.request.use(async (config) => {
    const attach = (t?: string | null) => {
        if (t)
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${t}`,
            };
    };

    if (typeof window === "undefined") {
        const s = await getServerSession(authOptions);
        attach((s as any)?.backendToken);
    } else {
        const s = await getSession();
        attach((s as any)?.backendToken);
    }
    return config;
});