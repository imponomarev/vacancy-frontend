import React, { ReactNode } from "react";

export function AuthFormWrapper({
                                    children,
                                    title,
                                    bottomText,
                                }: {
    children: ReactNode;
    title: string;
    bottomText: { text: string; href: string; linkText: string };
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-4">
            <div className="w-full max-w-md bg-white/90 dark:bg-slate-800/80 rounded-lg shadow-md p-8 space-y-6">
                <h1 className="text-2xl font-semibold text-center">{title}</h1>
                {children}
                <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                    {bottomText.text}{" "}
                    <a href={bottomText.href} className="text-primary hover:underline">
                        {bottomText.linkText}
                    </a>
                </p>
            </div>
        </div>
    );
}
