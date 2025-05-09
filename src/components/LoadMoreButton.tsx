"use client";
import { Button } from "@heroui/react";

export default function LoadMoreButton({
                                           onClick,
                                           disabled,
                                       }: {
    onClick: () => void;
    disabled: boolean;
}) {
    return (
        <Button
            variant="outline"
            onClick={onClick}
            disabled={disabled}
            className="
        border-[var(--primary)] text-[var(--primary)]
        hover:bg-[var(--primary-light)]/20 hover:text-[var(--primary-dark)]
        mx-auto mt-6
        rounded-md
        px-6 py-2
        transition
      "
        >
            {disabled ? "Загружаю…" : "Показать ещё"}
        </Button>
    );
}
