import VacancyList from "@/components/VacancyList";
import VacancySearchBar from "@/components/VacancySearchBar";
import PageSection from "@/components/PageSection";

export default function VacanciesPage() {
    return (
        <PageSection>
            <VacancySearchBar/>
            <VacancyList/>
        </PageSection>
    );
}
