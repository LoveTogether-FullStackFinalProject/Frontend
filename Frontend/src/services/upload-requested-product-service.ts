import apiClient from "./api-client";
import { Donation } from '../components/donation';

export interface requestedDonation{
    _id?: string;
    category: string;
    productType: string; 
    amount: number;
    itemCondition: string;
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
 
 const addRequestedProduct = async (donation: requestedDonation) => {
    const abortController = new AbortController();
      return await apiClient.post<Donation>("/requestedDonation/rdonation", donation, {
        signal: abortController.signal
      });
  };


  export default {uploadPhoto, addRequestedProduct  };