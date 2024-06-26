import apiClient from "./api-client";
import { Donation } from '../components/donation';

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


  export const addRequestedProduct = async (donation: requestedDonation) => {
    const abortController = new AbortController();
    const makeRequest = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found");
      }
      return await apiClient.post<Donation>("/requestedDonation/rdonation", donation, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        signal: abortController.signal
      });
    };
  
    let req;
    try {
      req = await makeRequest();
    } catch (err) {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found");
      }
      const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (tokenPayload.exp && tokenPayload.exp < currentTimestamp) {
        console.error("error expiration time:" + err);
        console.error("going to refreshToken");
        await refreshToken();
        req = await makeRequest();
      } else {
        throw err;
      }
    }
  
    return { req, abort: () => abortController.abort() };
  };


  const refreshToken = async () => {
    const abortController = new AbortController()
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
        throw new Error("No refresh token found");
    }
    const res = await apiClient.get('auth/refreshToken', { 
        headers: {
            'Authorization': `Bearer ${refreshToken}`
        },
        signal: abortController.signal
     });
    const newAccessToken = res.data.accessToken; 
    const newRefreshToken = res.data.refreshToken; 
    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("refreshToken", newRefreshToken);

}

  export default {uploadPhoto, addRequestedProduct  };