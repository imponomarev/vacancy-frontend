import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
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
    const list = useQuery({
        queryKey: ["vacFav"],
        queryFn: () => apiClient.get<Vacancy[]>("/favorites").then((r) => r.data),
    });

    const toggle = useMutation({
        mutationFn: async (v: Vacancy) => {
            const inFav = list.data?.some(
                (f) => f.source === v.source && f.externalId === v.externalId
            );
            return inFav
                ? apiClient.delete(
                    `/favorites/${v.source}/${v.externalId}`
                ) /* DELETE */
                : apiClient.post("/favorites", v); /* ADD   */
        },
        onMutate: (v) => {
            qc.setQueryData<Vacancy[]>(["vacFav"], (prev = []) =>
                mutateArray(prev, v)
            );
        },
        onError: () => qc.invalidateQueries({queryKey: ["vacFav"]}),
    });

    return {...list, toggle};
}

// ─── Resumes ─────────────────────────────────────────────────────
export function useResumeFavourites() {
    const qc = useQueryClient();
    const list = useQuery({
        queryKey: ["resFav"],
        queryFn: () =>
            apiClient.get<Resume[]>("/resume-favorites").then((r) => r.data),
    });

    const toggle = useMutation({
        mutationFn: async (r: Resume) => {
            const inFav = list.data?.some(
                (f) => f.source === r.source && f.externalId === r.externalId
            );
            return inFav
                ? apiClient.delete(
                    `/resume-favorites/${r.source}/${r.externalId}`
                )
                : apiClient.post("/resume-favourites", r);
        },
        onMutate: (r) => {
            qc.setQueryData<Resume[]>(["resFav"], (prev = []) =>
                mutateArray(prev, r)
            );
        },
        onError: () => qc.invalidateQueries({queryKey: ["resFav"]}),
    });

    return {...list, toggle};
}
