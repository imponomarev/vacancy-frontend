import type {Config} from "tailwindcss";
import {heroUi} from "@heroui/react";

export default <Partial<Config>>{
    darkMode: "class",
    content: [
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
        heroUi.content,      // обязательно!
    ],
    theme: {
        extend: {
            colors: {
                primary: "#2563eb",
                accent: {work: "#10b981", hire: "#f97316"},
            },
        },
    },
    plugins: [heroUi()],
};
