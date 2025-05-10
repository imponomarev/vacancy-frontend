"use client";

import dynamic from "next/dynamic";
import React from "react";

const Lottie = dynamic(() => import("lottie-react"), {ssr: false});

import loadingAnimation from "@/assets/loading.json";

export function LottieLoader() {
    return (
        <div
            className="
        fixed inset-0
        flex items-center justify-center
        bg-white bg-opacity-75
        z-50
      "
        >
            {/* Задаём конкретный размер контейнера */}
            <div style={{width: 300, height: 300}}>
                <Lottie
                    animationData={loadingAnimation}
                    loop
                    style={{width: "100%", height: "100%"}}
                />
            </div>
        </div>
    );
}
