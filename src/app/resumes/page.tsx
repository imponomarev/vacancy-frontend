import ResumeSearchBar from "@/components/ResumeSearchBar";
import ResumeList from "@/components/ResumeList";
import RequirePro from "@/components/RequirePro";
import PageSection from "@/components/PageSection";

export default function ResumesPage() {
    return (
        <RequirePro>
            <PageSection>
                <ResumeSearchBar/>
                <ResumeList/>
            </PageSection>
        </RequirePro>
    );
}
