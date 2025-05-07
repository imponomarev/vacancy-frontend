import Credentials from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { jwtDecode } from "jwt-decode";

interface JWTPayload {
    sub: string;
    role: "FREE" | "PRO";
    iat: number;
    exp: number;
}

export interface BackendLogin {
    token: string;
}

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },

    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "E-mail", type: "text" },
                password: { label: "Пароль", type: "password" },
            },

            async authorize(creds) {
                if (!creds) return null;

                // 1) Получаем JWT от бэкенда
                const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
                const loginUrl = new URL(`${apiUrl}/auth/login`);
                loginUrl.searchParams.set("email", creds.email as string);
                loginUrl.searchParams.set("pwd", creds.password as string);

                const res = await fetch(loginUrl.toString(), {
                    method: "POST",
                });
                if (!res.ok) return null;

                const { token } = (await res.json()) as BackendLogin;

                // 2) Декодируем токен и вытаскиваем роль
                const { role } = jwtDecode<JWTPayload>(token);

                return {
                    id: creds.email as string,
                    backendToken: token,
                    role,
                };
            },
        }),
    ],

    callbacks: {
        // Добавляем в JWT-поле backendToken и role после авторизации
        jwt({ token, user }) {
            if (user) {
                token.backendToken = (user as any).backendToken;
                token.role = (user as any).role;
            }
            return token;
        },
        // Прокидываем кастомные поля в клиентский session
        session({ session, token }) {
            session.backendToken = token.backendToken as string;
            session.user.role = token.role as "FREE" | "PRO";
            return session;
        },
    },
};
