import apiClient, { CanceledError } from './api-client';
import { Donation } from '../components/donation';
import { DonorData } from '../components/donorData';

export { CanceledError };

const getDonations = () => {
  const abortController = new AbortController();
  const req = apiClient.get<Donation[]>('/donations', { signal: abortController.signal });
  return { req, abort: () => abortController.abort() };
};

const getRequestedProducts = () => {
  const abortController = new AbortController();
  const req = apiClient.get<Donation[]>('/requestedDonation/rdonations', { signal: abortController.signal });
  return { req, abort: () => abortController.abort() };
};

const getUsers = () => {
  const abortController = new AbortController();
  const req = apiClient.get<DonorData[]>('/donor', { signal: abortController.signal });
  return { req, abort: () => abortController.abort() };
};

const getUser = (userId: string) => {
  const abortController = new AbortController();
  const req = apiClient.get(`/donor/${userId}`, { signal: abortController.signal });
  return { req, abort: () => abortController.abort() };
};

const updateDonation = (donationId: string, data: Partial<Donation>) => {
  return apiClient.put(`/update/${donationId}`, data);
};

const deleteDonation = (donationId: string) => {
  return apiClient.delete(`/delete/${donationId}`);
};

const getDonationsByUser = (userId: string) => {
  const abortController = new AbortController();
  const req = apiClient.get<Donation[]>(`/donation/user/${userId}`, { signal: abortController.signal })
  return { req, abort: () => abortController.abort() };
};

export default { getUser, getDonations, getDonationsByUser, updateDonation, deleteDonation, getRequestedProducts, getUsers };
