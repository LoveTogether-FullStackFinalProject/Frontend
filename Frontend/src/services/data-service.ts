import apiClient, { CanceledError } from './api-client';
import { Donation } from '../components/donation';
import { DonorData } from '../components/donorData'
import { requestedDonation } from "../services/upload-requested-product-service";
import { userDonation } from '../components/userDonation';
import logoutServiece from './logout-serviece';
import { AxiosError, AxiosResponse } from "axios";

// const AdminID = "668567c7bd9e16d610a11718";

export { CanceledError };

const makeRequest = async (request: () => Promise<AxiosResponse>) => {
  console.log("request is:",request);
  console.log(1);
  try {
    const response = await request();
    console.log("response is:",response);
    return response;
  } catch (axiosError: unknown) {
    if (axiosError instanceof AxiosError && axiosError.response) {
      console.log("error!!", axiosError);
      console.log(2);

      if (axiosError.response.status === 401) {
        console.log(3);
        const refreshToken = localStorage.getItem("refreshToken");
       if (!refreshToken) {
        throw new Error("No refresh token found");
       }
       console.log("going to refreshToken:");
        const refreshResponse = await apiClient.get('auth/refreshToken', { 
          headers: {
            'Authorization': `Bearer ${refreshToken}`
          },
       });

        if (refreshResponse.status === 200) {
          localStorage.setItem('accessToken',refreshResponse.data.accessToken);
          localStorage.setItem("refreshToken", refreshResponse.data.refreshToken);
          console.log("new access token:",refreshResponse.data.accessToken);
          console.log("new refresh token:",refreshResponse.data.refreshToken);
          console.log("going to request");
          return request();
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

const updateUser = (userId: string, data: Partial<DonorData>) => {
  const request = () => {
    const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found");
      }
      console.log("accessToken in request:",accessToken);
    return apiClient.put(`/donor/${userId}`,data,{
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
    });
  };
  return makeRequest(request);
};

const deleteUser = (userId: string) => {
  const request = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found");
    }
    return apiClient.delete(`/donor/${userId}`,{
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
    });
  };
  return makeRequest(request);
};

const updateDonation = async (donationId: string, data: Partial<userDonation>) => {
  const request = () => {
    const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found");
      }

    return apiClient.put(`/donation/update/${donationId}`, data,{
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
    });
  };
  return makeRequest(request);
};

const deleteDonation = async (donationId: string) => {
  const request = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found");
    }
    return apiClient.delete(`/donation/delete/${donationId}`,{
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
    });
  };
  return makeRequest(request);
};

const getDonationsByUser = (userId: string) => {
  const abortController = new AbortController();
  const req = apiClient.get<userDonation[]>(`/donation/user/${userId}`, { signal: abortController.signal });
  return { req, abort: () => abortController.abort() };
};

const updateUserData = async (userId: string, data: Partial<DonorData>) => {
  console.log("updateUserData");
  const request = () => {
    const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found");
      }
      console.log("accessToken in request:",accessToken);
    return apiClient.put(`/donor/${userId}`, data,{
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
    });
  };
  return makeRequest(request);
};

export const logout = () => {
  logoutServiece.postLogout();
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userID');
};

// export const getAdmin = () => {
//   return getUser(AdminID);
// }


const updateRequestedDonation = async (donationId: string,data: Partial<requestedDonation> ) => {
  const request = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found");
    }
    return apiClient.put(`/requestedDonation/rdonation/update/${donationId}`, data,{
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
    });
  };
  return makeRequest(request);
};

const deleteRequestedDonation = async (donationId: string) => {
  const request = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found");
    }
    return apiClient.delete(`/requestedDonation/rdonation/delete/${donationId}`,{
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
    });
  };
  return makeRequest(request);
};

export default { getUser, getUsers, updateUser, deleteUser, getDonations, getDonationsByUser, updateDonation, deleteDonation, getRequestedProducts, updateUserData, updateRequestedDonation, deleteRequestedDonation };
