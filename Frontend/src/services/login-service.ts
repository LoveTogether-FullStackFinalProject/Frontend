
import apiClient from "./api-client"
import { CredentialResponse } from "@react-oauth/google"


export interface IDonor {
  email: string,
  password?: string,
  _id?: string,
  accessToken?: string,
  refreshToken?: string
}


export const postLogIn = async (email: string, password: string): Promise<IDonor> => {
  return new Promise<IDonor>((resolve, reject) => {
      apiClient.post<IDonor>("auth/login", { email, password })
          .then((response) => {
              resolve(response.data)
          }).catch((error) => {
              reject(error)
          })
  })
}

export const googleSignin = (credentialResponse: CredentialResponse) => {
    return new Promise<IDonor>((resolve, reject) => {
        apiClient.post("auth/google", credentialResponse).then((response) => {
            console.log(response)
            resolve(response.data)
        }).catch((error) => {
            console.log(error)
            reject(error)
        })
    })
}