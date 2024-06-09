import { IDonor } from './login-service';
import apiClient from './api-client'; 

export const registerUser = async (user: any) => {
    try {
        const response = await apiClient.post<IDonor>('/auth/register', user);
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw new Error('Registration failed');
    }
};

export const googleSignIn = async (credentialResponse: any) => {
    try {
        const response = await apiClient.post('/googleSignIn', credentialResponse);
        return response.data;
    } catch (error) {
        throw new Error('Google Sign-In failed');
    }
};