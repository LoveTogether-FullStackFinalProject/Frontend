import apiClient from "./api-client";
import { Donation } from '../components/donation';
import { AxiosError, AxiosResponse } from "axios";

export interface requestedDonation{
    _id?: string;
    itemName: string;
    category: string;
    // productType: string; 
    amount: number;
    itemCondition: string;
    expirationDate?: string;
    description: string;
    image?: string;
    customCategory?: string;
  }


const uploadPhoto = async (photo: File) => {
    return new Promise<string>((resolve, reject) => {
        console.log("Uploading photo..." + photo)
        const formData = new FormData();
        if (photo) {
            formData.append("file", photo);
            apiClient.post("/photos/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            }).then(res => {
                console.log(res);
                resolve(res.data.url);
            }).catch(err => {
                console.log(err);
                reject(err);
            });
        }
    });
};
 
//  const addRequestedProduct = async (donation: requestedDonation) => {
//     const abortController = new AbortController();
//       return await apiClient.post<Donation>("/requestedDonation/rdonation", donation, {
//         signal: abortController.signal
//       });
//   };


  // export const addRequestedProduct = async (donation: requestedDonation) => {
  //   const abortController = new AbortController();
  //   const makeRequest = async () => {
  //     const accessToken = localStorage.getItem("accessToken");
  //     if (!accessToken) {
  //       throw new Error("No access token found");
  //     }
  //     return await apiClient.post<Donation>("/requestedDonation/rdonation", donation, {
  //       headers: {
  //         'Authorization': `Bearer ${accessToken}`
  //       },
  //       signal: abortController.signal
  //     });
  //   };
  
  //   let req;
  //   try {
  //     req = await makeRequest();
  //   } catch (err) {
  //     const accessToken = localStorage.getItem("accessToken");
  //     if (!accessToken) {
  //       throw new Error("No access token found");
  //     }
  //     const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
  //     const currentTimestamp = Math.floor(Date.now() / 1000);
  //     if (tokenPayload.exp && tokenPayload.exp < currentTimestamp) {
  //       console.error("error expiration time:" + err);
  //       console.error("going to refreshToken");
  //       await refreshToken();
  //       req = await makeRequest();
  //     } else {
  //       throw err;
  //     }
  //   }
  
  //   return { req, abort: () => abortController.abort() };
  // };


//   const refreshToken = async () => {
//     const abortController = new AbortController()
//     const refreshToken = localStorage.getItem("refreshToken");
//     if (!refreshToken) {
//         throw new Error("No refresh token found");
//     }
//     const res = await apiClient.get('auth/refreshToken', { 
//         headers: {
//             'Authorization': `Bearer ${refreshToken}`
//         },
//         signal: abortController.signal
//      });
//     const newAccessToken = res.data.accessToken; 
//     const newRefreshToken = res.data.refreshToken; 
//     localStorage.setItem("accessToken", newAccessToken);
//     localStorage.setItem("refreshToken", newRefreshToken);

// }


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

const addRequestedProduct = async (donation: requestedDonation) => {
  const request = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found");
    }
    return  apiClient.post<Donation>("/requestedDonation/rdonation", donation,{
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
    });
  };
  return makeRequest(request);

};

const editRequestedProduct = async (donationId: string,donation: requestedDonation) => {
  const request = () => {
    console.log("donationId",donationId);
    const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          throw new Error("No access token found");
        }
    return apiClient.put<Donation>(`/requestedDonation/rdonation/update/${donationId}`, donation, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
    });
  };
  return makeRequest(request);

};


  export default {uploadPhoto, addRequestedProduct,editRequestedProduct};