import axios from 'axios';

const BASE_URL = 'https://NeedToFill.cs.colman.ac.il'; // Ensure this is the correct URL

export const uploadProduct = async (productData: any) => {
    try {
        const response = await axios.post(`${BASE_URL}/donation/upload`, productData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Product upload failed');
    }
};

export const uploadPhoto = async (photo: File) => {
    const formData = new FormData();
    formData.append('file', photo);

    try {
        const response = await axios.post(`${BASE_URL}/file/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.url;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Photo upload failed');
    }
};
