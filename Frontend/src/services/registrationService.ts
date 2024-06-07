import axios from 'axios';

export const registerUser = async (user: any) => {
    try {
        const response = await axios.post('/register', user);
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw new Error('Registration failed');
    }
};

export const googleSignIn = async (credentialResponse: any) => {
    try {
        const response = await axios.post('/googleSignIn', credentialResponse);
        return response.data;
    } catch (error) {
        throw new Error('Google Sign-In failed');
    }
};
