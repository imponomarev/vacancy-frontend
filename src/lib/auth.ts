import Credentials from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    session: { strategy: "jwt" },

    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Пароль", type: "password" },
            },
            async authorize(creds) {
                if (!creds) return null;
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/login?email=${creds.email}&pwd=${creds.password}`,
                    { method: "POST" }
                ).then((r) => r.json());
                return { id: creds.email, token: res.token };
            },
        }),
    ],

    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) token.backendToken = (user as any).token;
            return token;
        },
        session: async ({ session, token }) => {
            (session as any).backendToken = token.backendToken;
            return session;
        },
    },
};
