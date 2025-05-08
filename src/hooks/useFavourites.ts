import {useQuery, useMutation, useQueryClient, UseQueryOptions} from "@tanstack/react-query";
import {apiClient} from "@/lib/axios";
import type {Vacancy, Resume} from "@/api/model";

function mutateArray<T extends { source: string; externalId: string }>(
    arr: T[],
    item: T
) {
    const idx = arr.findIndex(
        (f) => f.source === item.source && f.externalId === item.externalId
    );
    return idx === -1 ? [...arr, item] : arr.filter((_, i) => i !== idx);
}

// ─── Vacancies ───────────────────────────────────────────────────
export function useVacancyFavourites() {
    const qc = useQueryClient();

    const list = useQuery<Vacancy[]>({
        queryKey: ["vacFav"],
        queryFn: () => apiClient.get<Vacancy[]>("/favorites").then((r) => r.data),
    });

    const toggle = useMutation<void, unknown, Vacancy>({
        mutationFn: async (v) => {
            const inFav = list.data?.some(
                (f) => f.source === v.source && f.externalId === v.externalId
            );
            if (inFav) {
                await apiClient.delete(`/favorites/${v.source}/${v.externalId}`);
            } else {
                await apiClient.post("/favorites", v);
            }
        },
        onMutate: (v) => {
            qc.setQueryData<Vacancy[]>(["vacFav"], (prev = []) =>
                mutateArray(prev, v)
            );
        },
        onError: () => {
            qc.invalidateQueries({queryKey: ["vacFav"]});
        },
        onSettled: () => {
            qc.invalidateQueries({queryKey: ["vacFav"]});
        },
    });

    return {...list, toggle};
}

// ─── Resumes ─────────────────────────────────────────────────────
export function useResumeFavourites(
    filters: Record<string, unknown> = {},
    options: UseQueryOptions<Resume[]> = {}
) {
    const qc = useQueryClient();

    // Прокидываем options.enabled сюда:
    const list = useQuery<Resume[]>({
        queryKey: ["resFav", filters],
        queryFn: () =>
            apiClient.get<Resume[]>("/resume-favorites", {params: filters}).then((r) => r.data),
        ...options,
    });

    const toggle = useMutation<void, unknown, Resume>({
        mutationFn: async (r) => {
            const inFav = list.data?.some(
                (f) => f.source === r.source && f.externalId === r.externalId
            );
            if (inFav) {
                await apiClient.delete(`/resume-favorites/${r.source}/${r.externalId}`);
            } else {
                await apiClient.post("/resume-favorites", r);
            }
        },
        onMutate: (r) => {
            qc.setQueryData<Resume[]>(["resFav", filters], (prev = []) =>
                mutateArray(prev, r)
            );
        },
        onError: () => {
            qc.invalidateQueries({queryKey: ["resFav", filters]});
        },
        onSettled: () => {
            qc.invalidateQueries({queryKey: ["resFav", filters]});
        },
    });

    return {...list, toggle};
}
