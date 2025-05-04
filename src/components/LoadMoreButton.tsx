"use client";
import {Button} from "@heroui/react";

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
            className="mx-auto mt-6"
        >
            {disabled ? "Загружаю…" : "Показать ещё"}
        </Button>
    );
}
