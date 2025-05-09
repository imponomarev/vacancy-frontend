import ResumeSearchBar from "@/components/ResumeSearchBar";
import ResumeList from "@/components/ResumeList";
import RequirePro from "@/components/RequirePro";

export default function ResumesPage() {
    return (
        <RequirePro>
            <section className="container mx-auto py-6 px-4">
                <ResumeSearchBar target="resumes" />
                <ResumeList />
            </section>
        </RequirePro>
    );
}
