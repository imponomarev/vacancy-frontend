import axios from "axios";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080",
});

apiClient.interceptors.request.use(async config => {
    const session = await getServerSession(authOptions);
    if (session?.backendToken) {
        config.headers.Authorization = `Bearer ${session.backendToken}`;
    }
    return config;
});
