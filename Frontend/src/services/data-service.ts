import apiClient, { CanceledError } from './api-client';
import { Donation } from '../components/donation';
import { DonorData } from '../components/donorData'
import {requestedDonation} from "../services/upload-requested-product-service";
import { userDonation } from '../components/userDonation';
import logoutServiece from './logout-serviece';

const AdminID="668567c7bd9e16d610a11718";

export { CanceledError };

const getDonations = () => {
  const abortController = new AbortController();
  const req = apiClient.get<Donation[]>('/donation/donations', { signal: abortController.signal });
  return { req, abort: () => abortController.abort() };
};


const getRequestedProducts = () => {
  const abortController = new AbortController();
  const req = apiClient.get<requestedDonation[]>('/requestedDonation/rdonations', { signal: abortController.signal });
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

const updateDonation = (donationId: string, data: Partial<userDonation>) => {
  return apiClient.put(`/donation/update/${donationId}`, data);
};

const deleteDonation = (donationId: string) => {
  return apiClient.delete(`/donation/delete/${donationId}`);
};

const getDonationsByUser = (userId: string) => {
  const abortController = new AbortController();
  const req = apiClient.get<userDonation[]>(`/donation/user/${userId}`, { signal: abortController.signal });
  return { req, abort: () => abortController.abort() };
};

const updateUserData = (userId: string, data: Partial<DonorData>) => {
  return apiClient.put(`/donor/${userId}`, data);
};

export const logout = () => {
  logoutServiece.postLogout();
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userID');
};

export const getAdmin = () => {
  return getUser(AdminID);
}

export default { getUser, getDonations, getDonationsByUser, updateDonation, deleteDonation, getRequestedProducts, getUsers,updateUserData,getAdmin};
