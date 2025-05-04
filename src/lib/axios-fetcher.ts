import {AxiosRequestConfig} from 'axios';
import {apiClient} from './axios';

export const axiosFetcher = <TData>(
    config: AxiosRequestConfig,
): Promise<TData> => {
    return apiClient.request<TData>(config).then(({data}) => data);
};
