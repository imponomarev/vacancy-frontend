import SearchBar from "@/components/SearchBar";
import ResumeList from "@/components/ResumeList";

export default function ResumesPage() {
    return (
        <section className="container mx-auto py-6 px-4">
            <SearchBar/>
            <ResumeList/>
        </section>
    );
}
