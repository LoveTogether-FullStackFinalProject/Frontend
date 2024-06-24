
import apiClient from "./api-client"


export interface IUser {
  email: string,
  password?: string,
  image?: string,
  _id?: string,
  accessToken?: string,
  refreshToken?: string
}


export const postLogout = async () => {
  const abortController = new AbortController()
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
      throw new Error("No refresh token found");
  }
  console.log( refreshToken);
  await apiClient.get('auth/logout', { 
      headers: {
          'Authorization': `Bearer ${refreshToken}`
      },
      signal: abortController.signal
   });
   localStorage.removeItem('accessToken');
   localStorage.removeItem('refreshToken');
   localStorage.removeItem('userID');
<<<<<<< HEAD

=======
>>>>>>> 8f513d46689f719c451aea580a9f57ed6e3de24d
  };

  

export default {postLogout}