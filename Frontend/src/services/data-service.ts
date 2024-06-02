import apiClient, { CanceledError } from "./api-client";
import { ProductData } from '../components/product';
import { DonorData } from '../components/donorData';

export { CanceledError };

const getProducts = () => {
    const abortController = new AbortController();
    const req = apiClient.get<ProductData[]>('/donation/donations', { signal: abortController.signal });
    return { req, abort: () => abortController.abort() };
};

const getRequestedProducts = () => {
    const abortController = new AbortController();
    const req = apiClient.get<ProductData[]>('/requestedDonation/rdonations', { signal: abortController.signal });
    return { req, abort: () => abortController.abort() };
};

const getUsers = () => {
    const abortController = new AbortController();
    const req = apiClient.get<DonorData[]>(`/donor/`, { signal: abortController.signal });
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

export const deleteDonation = async (donationId: string) => {
    try {
      const response = await apiClient.delete(`/donation/${donationId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

export default { getUser, getProducts, updateDonation, deleteDonation,getRequestedProducts, getUsers };
