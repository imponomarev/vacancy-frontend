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
        mutationFn: (v: Vacancy) => apiClient.post("/favorites", v),
        // оптимистично обновляем кэш
        onMutate: async (v) => {
            await qc.cancelQueries({queryKey: ["vacFav"]});
            const prev = qc.getQueryData<Vacancy[]>(["vacFav"]) ?? [];
            const exists = prev.some(f => f.externalId === v.externalId && f.source === v.source);
            const next = exists ? prev.filter(f => f.externalId !== v.externalId || f.source !== v.source)
                : [...prev, v];
            qc.setQueryData(["vacFav"], next);
            return {prev};
        },
        onError: (_e, _v, ctx) => ctx?.prev && qc.setQueryData(["vacFav"], ctx.prev),
        onSettled: () => qc.invalidateQueries({queryKey: ["vacFav"]}),
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
        mutationFn: (r: Resume) => apiClient.post("/resume-favorites", r),
        onMutate: async (r) => {
            await qc.cancelQueries({queryKey: ["resFav"]});
            const prev = qc.getQueryData<Resume[]>(["resFav"]) ?? [];
            const exists = prev.some(f => f.externalId === r.externalId && f.source === r.source);
            const next = exists ? prev.filter(f => f.externalId !== r.externalId || f.source !== r.source)
                : [...prev, r];
            qc.setQueryData(["resFav"], next);
            return {prev};
        },
        onError: (_e, _r, ctx) => ctx?.prev && qc.setQueryData(["resFav"], ctx.prev),
        onSettled: () => qc.invalidateQueries({queryKey: ["resFav"]}),
    });

    return {...list, toggle};
}
