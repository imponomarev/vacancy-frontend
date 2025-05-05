"use client";
import {Heart, HeartOff} from "lucide-react";
import {Button} from "@heroui/react";

export default function LikeButton({liked, onToggle,}: {
    liked: boolean;
    onToggle: () => void;
}) {
    return (
        <Button size="icon" variant="ghost" onClick={onToggle}>
            {liked ? <Heart className="fill-red-500 stroke-red-500"/> : <HeartOff/>}
        </Button>
    );
}
