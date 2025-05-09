import VacancyList from "@/components/VacancyList";
import VacancySearchBar from "@/components/VacancySearchBar";

export default function VacanciesPage() {
    return (
        <section className="container mx-auto py-6 px-4">
            <VacancySearchBar />
            <VacancyList />
        </section>
    );
}
