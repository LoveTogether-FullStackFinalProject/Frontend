import apiClient from "./api-client";
import { CredentialResponse } from "@react-oauth/google";

export interface IDonor {
  email: string;
  password?: string;
  _id?: string;
  accessToken?: string;
  refreshToken?: string;
}

export const postLogIn = async (email: string, password: string): Promise<IDonor> => {
  return new Promise<IDonor>((resolve, reject) => {
    apiClient.post<IDonor>("auth/login", { email, password })
      .then((response) => {
        if (response.data._id) {
          localStorage.setItem('userID', response.data._id);
        }
        resolve(response.data);
      }).catch((error) => {
        reject(error);
      });
  });
}

export const googleSignin = (credentialResponse: CredentialResponse) => {
  return new Promise<IDonor>((resolve, reject) => {
    apiClient.post("auth/googleSignIn", credentialResponse).then((response) => {
      if (response.data._id) {
        localStorage.setItem('userID', response.data._id);
      }
      resolve(response.data);
    }).catch((error) => {
      reject(error);
    });
  });
}


// export const googleSignin = async (credentialResponse: any) => {
//   try {
//       const response = await apiClient.post('/auth/googleSignIn', credentialResponse);
//       return response.data;
//   } catch (error) {
//       throw new Error('Google Sign-In failed');
//   }
// };