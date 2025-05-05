import {notFound} from "next/navigation";
import ContactModal from "@/components/ContactModal";
import {Resume} from "@/api/model";
import {apiClient} from "@/lib/axios";

interface Props {
    params: Promise<{
        source: string;
        externalId: string;
    }>;
}

export default async function ResumeDetail({params}: Props) {
    const {source, externalId} = await params;

    const res = await apiClient.get<Resume[]>("/resume-favorites"); // пробуем из кэша
    const resume =
        res.data.find((r) => r.source === source && r.externalId === externalId) ??
        null;

    if (!resume) return notFound();

    return (
        <section className="container mx-auto py-6 px-4">
            <h1 className="text-2xl font-bold">
                {resume.firstName} {resume.lastName}
            </h1>
            <p className="mt-2">{resume.position}</p>
            <ContactModal contacts={resume.url}/>
        </section>
    );
}
