"use client";
import {Card, Badge} from "@heroui/react";
import Link from "next/link";
import type {Resume} from "@/api/model";

export default function ResumeCard({r}: { r: Resume }) {
    return (
        <Link href={`/resumes/${r.source}/${r.externalId}`}>
            <Card className="p-4 hover:shadow-lg transition">
                <h3 className="text-lg font-semibold">{r.firstName} {r.lastName}</h3>
                <p className="text-sm text-slate-500">{r.position}</p>
                {r.salary && (
                    <Badge className="mt-2">
                        {r.salary} {r.currency}
                    </Badge>
                )}
                <p className="text-xs text-slate-400 mt-1">{r.experienceMonths} мес. опыта</p>
            </Card>
        </Link>
    );
}
