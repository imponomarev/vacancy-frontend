import "next-auth";

declare module "next-auth" {
    interface User {
        role?: "FREE" | "PRO";
        backendToken?: string;
    }

    interface Session {
        user: {
            role?: "FREE" | "PRO";
            backendToken?: string;
        };
    }
}
