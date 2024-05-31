import apiClient, { CanceledError } from "./api-client";
import { ProductData } from '../components/product';

export { CanceledError };

const getProducts = () => {
    const abortController = new AbortController();
    const req = apiClient.get<ProductData[]>('/donation/donations', { signal: abortController.signal });
    return { req, abort: () => abortController.abort() };
};

const getUser = (userId: string) => {
    const abortController = new AbortController();
    const req = apiClient.get(`/donor/${userId}`, { signal: abortController.signal });
    return { req, abort: () => abortController.abort() };
};

const updateDonation = (donationId: string, data: Partial<ProductData>) => {
    return apiClient.put(`/donation/${donationId}`, data);
};

const deleteDonation = (donationId: string) => {
    return apiClient.delete(`/donation/${donationId}`);
};

export default { getUser, getProducts, updateDonation, deleteDonation };
