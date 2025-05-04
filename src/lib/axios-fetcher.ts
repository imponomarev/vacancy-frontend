import {AxiosRequestConfig} from 'axios';
import {apiClient} from '@/lib/axios';

export const axiosFetcher = <TData>(
    config: AxiosRequestConfig,
): Promise<TData> => {
    return apiClient.request<TData>(config).then(({data}) => data);
};
