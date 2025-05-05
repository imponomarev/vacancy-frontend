import {apiClient} from "./axios";

export async function createProCheckout() {
    const {data} = await apiClient.post<string>("/payments/pro");
    return data; // confirmation_token
}
