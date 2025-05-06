import Credentials from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

export interface BackendLogin {
    token: string;
}

export const authOptions: NextAuthOptions = {
    session: { strategy: "jwt" },

    providers: [
        Credentials({
            name: "Credentials",
            async authorize(creds) {
                if (!creds) return null;

                const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`);
                url.searchParams.set("email", creds.email as string);
                url.searchParams.set("pwd", creds.password as string);

                const res = await fetch(url.toString(), { method: "POST" });
                if (!res.ok) return null;
                const json = (await res.json()) as BackendLogin;

                return json.token ? { id: creds.email as string, backendToken: json.token } : null;
            },
            credentials: {
                email: { label: "E‑mail", type: "text" },
                password: { label: "Пароль", type: "password" },
            },
        }),
    ],

    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.backendToken = (user as any).backendToken;
                token.role = (user as any).role;
            }
            return token;
        },
        session({ session, token }) {
            session.backendToken = token.backendToken as string;
            session.user.role = (token.role as any) ?? "FREE";
            return session;
        },
    },
};
