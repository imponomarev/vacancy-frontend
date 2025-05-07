import NextAuth, { DefaultSession, DefaultUser, DefaultJWT } from "next-auth";

declare module "next-auth" {
    /**
     * Встроенные поля User дополняются вашим `role` и `backendToken`
     */
    interface User extends DefaultUser {
        role: "FREE" | "PRO";
        backendToken: string;
    }

    interface Session extends DefaultSession {
        /**
         * Поле `user` по умолчанию содержит у себя
         * все свойства DefaultSession["user"],
         * плюс ваши кастомные
         */
        user: {
            role: "FREE" | "PRO";
            backendToken: string;
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    /**
     * Расширяем плеймейкеры JWT, чтобы TypeScript знал
     * о кастомных полях в токене
     */
    interface JWT extends DefaultJWT {
        role: "FREE" | "PRO";
        backendToken: string;
    }
}
