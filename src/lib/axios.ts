import axios, {AxiosRequestConfig} from "axios";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getSession } from "next-auth/react";

export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,   // ← точно заполнена
});

apiClient.interceptors.request.use(async (config: AxiosRequestConfig) => {
    const attach = (token?: string | null) => {
        if (token) config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
    };

    if (typeof window === "undefined") {
        // RSC / API route
        const sess = await getServerSession(authOptions);
        attach((sess as any)?.backendToken);
    } else {
        const sess = await getSession();
        attach((sess as any)?.backendToken);
    }
    return config;
});
