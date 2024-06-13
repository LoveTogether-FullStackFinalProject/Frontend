import apiClient, { CanceledError } from "./api-client"
import { Donation } from '../components/donation'
import { DonorData } from '../components/donorData';


export { CanceledError };

const getDonations = () => {
    const abortController = new AbortController()
    const req = apiClient.get<Donation[]>('/donation/donations', { signal: abortController.signal })
    return { req, abort: () => abortController.abort() }
}

const getRequestedProducts = () => {
    const abortController = new AbortController();
    const req = apiClient.get<Donation[]>('/requestedDonation/rdonations', { signal: abortController.signal });
    return { req, abort: () => abortController.abort() };
};

const getUsers = () => {
    const abortController = new AbortController();
    const req = apiClient.get<DonorData[]>('/donor/', { signal: abortController.signal });
    return { req, abort: () => abortController.abort() };
};

const getUser = (userId: string) => {
    const abortController = new AbortController();
    const req = apiClient.get(`/donor/${userId}`, { signal: abortController.signal });
    return { req, abort: () => abortController.abort() };
};

const updateDonation = (donationId: string, data: Partial<Donation>) => {
    return apiClient.put(`/donation/update/${donationId}`, data);
};

const deleteDonation = (donationId: string) => {
    return apiClient.delete(`/donation/${donationId}`);
};

const getAdmin = () =>{
    return apiClient.get(`/admin/admin`);
}

const getAllUsers = () => {
    return apiClient.get(`/admin`);
}

export default { getUser, getDonations, updateDonation, deleteDonation, getRequestedProducts, getUsers , getAdmin,getAllUsers};
