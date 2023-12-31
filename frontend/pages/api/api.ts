import axios from 'axios'
const URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://localhost:7126';


export const register = async (RegisterUser: any) => {
   return axios.post(`${URL}/auth/register`, RegisterUser)
 }

 export const login = async (LoginUser: any) => {
   return axios.post(`${URL}/auth/login`, LoginUser)
 }

 export const editProfile = async (EditUser: any) => {
    return axios.put(`${URL}/profile/edit`, EditUser)
  }

