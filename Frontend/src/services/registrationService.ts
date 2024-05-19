import axios from 'axios';
import { User } from '../componentss/Profile';
export const registerUser = async (user: IUser) => {
    try {
        const response = await axios.post('/api/register', user);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Registration failed');
    }
};

export const googleSignIn = async (credentialResponse: any) => {
    try {
        const response = await axios.post('/api/google-signin', { token: credentialResponse.credential });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Google sign-in failed');
    }
};
