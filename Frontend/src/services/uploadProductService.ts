import axios from 'axios';

const BASE_URL = 'http://localhost:3000'; 

export const uploadPhoto = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(`${BASE_URL}/photos/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.url;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Photo upload failed');
    }
};

export const uploadProduct = async (productData: any) => {
    try {
        const response = await axios.post(`${BASE_URL}/products/upload`, productData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Product upload failed');
    }
};
