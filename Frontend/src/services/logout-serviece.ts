
import apiClient from "./api-client"



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

  };

export default {postLogout}