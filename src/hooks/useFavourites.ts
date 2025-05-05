import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {apiClient} from "@/lib/axios";
import type {Vacancy, Resume} from "@/api/model";

export function useVacancyFavourites() {
    const qc = useQueryClient();

    const list = useQuery({
        queryKey: ["vacFav"],
        queryFn: () => apiClient.get<Vacancy[]>("/favorites").then(r => r.data),
    });

    const toggle = useMutation({
        mutationFn: (v: Vacancy) =>
            apiClient.post("/favorites", v).then(r => r.data),
        onSuccess: () => qc.invalidateQueries({queryKey: ["vacFav"]}),
    });

    return {...list, toggle};
}

export function useResumeFavourites() {
    const qc = useQueryClient();

    const list = useQuery({
        queryKey: ["resFav"],
        queryFn: () => apiClient.get<Resume[]>("/resume-favorites").then(r => r.data),
    });

    const toggle = useMutation({
        mutationFn: (r: Resume) =>
            apiClient.post("/resume-favorites", r).then(r => r.data),
        onSuccess: () => qc.invalidateQueries({queryKey: ["resFav"]}),
    });

    return {...list, toggle};
}
