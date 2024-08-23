//import axios from 'axios';
import apiClient from "./api-client";
import { AxiosError, AxiosResponse } from "axios";

// Comment out or keep for future use
// export const uploadPhoto = async (file: File) => {
//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//         const response = await axios.post(`${BASE_URL}/photos/upload`, formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             },
//         });
//         return response.data.url;
//     } catch (error) {
//         throw new Error(error.response?.data?.message || 'Photo upload failed');
//     }
// };

// interface IUpoloadResponse {
//     url: string;
// }

export const uploadPhoto = async (photo: File) => {
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

// export const uploadProduct = async (productData: any) => {
//     try {
//         const response = await apiClient.post(`/donation/upload`, productData);
//         return response.data;
//     } catch (error) {
//         console.error('Product upload error:', error.response?.data?.message || error.message);
//         throw new Error(error.response?.data?.message || 'Product upload failed');
//     }
// };


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
  
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   export const uploadProduct = async (productData: any) => {
    const request = () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found");
      }
      return apiClient.post(`/donation/upload`, productData,{
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
      });
    };
    return makeRequest(request);
  };


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const uploadProductAnonymously = async (productData: any) => {
    return apiClient.post(`donation/upload-anonymously`, productData);

  };
  