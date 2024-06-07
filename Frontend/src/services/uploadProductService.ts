import axios from 'axios';

export const uploadProduct = async (productData: any) => {
    try {
        const response = await axios.post('/products/upload', productData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Product upload failed');
    }
};

export const uploadPhoto = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post('/photos/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.url;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Photo upload failed');
    }
};
