import {AxiosRequestConfig} from 'axios';
import {apiClient} from './axios';

export const axiosFetcher = <T>(config: AxiosRequestConfig): Promise<T> =>
    apiClient.request<T>(config).then((r) => r.data);
