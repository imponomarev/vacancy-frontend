import SearchBar from "@/components/SearchBar";
import VacancyList from "@/components/VacancyList";

export default function VacanciesPage() {
    return (
        <section className="container mx-auto py-6 px-4">
            <SearchBar />
            <VacancyList />
        </section>
    );
}
