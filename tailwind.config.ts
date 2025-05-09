import type { Config } from "tailwindcss";
import { heroUi } from "@heroui/react";

export default <Partial<Config>>{
    darkMode: "class",
    content: [
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
        heroUi.content,
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#8d6e63", // терракотовый
                    light:   "#a1887f",
                    dark:    "#5d4037",
                },
                secondary: {
                    DEFAULT: "#6d4c41", // темно-коричневый
                    light:   "#8d6e63",
                    dark:    "#4e342e",
                },
                success: {
                    DEFAULT: "#a5d6a7", // мятно-зеленый
                    light:   "#c8e6c9",
                    dark:    "#66bb6a",
                },
                danger: {
                    DEFAULT: "#d84315", // красноватый кирпич
                    light:   "#ff5722",
                    dark:    "#bf360c",
                },
                muted: {
                    100: "#efebe9",
                    500: "#8d6e63",
                    800: "#3e2723",
                },
            },
        },
    },
    plugins: [heroUi()],
};
