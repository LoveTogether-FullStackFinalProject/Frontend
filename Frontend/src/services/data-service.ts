import apiClient, { CanceledError } from './api-client';
import { Donation } from '../components/donation';
import { DonorData } from '../components/donorData'
import {requestedDonation} from "../services/upload-requested-product-service";
import { userDonation } from '../components/userDonation';
import logoutServiece from './logout-serviece';
import { AxiosError, AxiosResponse } from "axios";

const AdminID="668567c7bd9e16d610a11718";

export { CanceledError };


const makeRequest = async (request: () => Promise<AxiosResponse>) => {
  console.log(1);
  try {
    const response = await request();
    return response;
  } catch (axiosError: unknown) {
    if (axiosError instanceof AxiosError && axiosError.response) {
      console.log("error!!", axiosError);
      console.log(2);

      if (axiosError.response.status === 401) {
        const error = axiosError.response.data.error;
        if (error === "Token is expired") {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            throw new Error("Authentication expired, please login again");
          }

          const refreshResponse = await apiClient.post(`/auth/refreshToken`, {
            refreshToken,
          });

          if (refreshResponse.status === 200) {
            localStorage.setItem( 'accessToken',refreshResponse.data.accessToken);
            localStorage.setItem("refreshToken", refreshResponse.data.refreshToken);
            return request();
          }
        }
      }
    }
  }
};


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

// const updateDonation = (donationId: string, data: Partial<userDonation>) => {
//   return apiClient.put(`/donation/update/${donationId}`, data);
// };

const updateDonation = async (donationId: string, data: Partial<userDonation>) => {
  const request = () => {
    return apiClient.put(`/donation/update/${donationId}`, data);
  };
  return makeRequest(request);
};

// const deleteDonation = (donationId: string) => {
//   return apiClient.delete(`/donation/delete/${donationId}`);
// };

const deleteDonation = async (donationId: string) => {
  const request = () => {
    return apiClient.delete(`/donation/delete/${donationId}`);
  };
  return makeRequest(request);
};


const getDonationsByUser = (userId: string) => {
  const abortController = new AbortController();
  const req = apiClient.get<userDonation[]>(`/donation/user/${userId}`, { signal: abortController.signal });
  return { req, abort: () => abortController.abort() };
};

// const updateUserData = (userId: string, data: Partial<DonorData>) => {
//   return apiClient.put(`/donor/${userId}`, data);
// };

const updateUserData = async (userId: string, data: Partial<DonorData>) => {
  const request = () => {
    return apiClient.put(`/donor/${userId}`, data);
  };
  return makeRequest(request);
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
