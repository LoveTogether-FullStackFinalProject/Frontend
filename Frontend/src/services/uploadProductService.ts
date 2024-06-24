import axios from 'axios';
import apiClient from "./api-client";

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

interface IUpoloadResponse {
    url: string;
}

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

export const uploadProduct = async (productData: any) => {
    try {
        const response = await apiClient.post(`/donation/upload`, productData);
        return response.data;
    } catch (error) {
        console.error('Product upload error:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Product upload failed');
    }
};
