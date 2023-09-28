// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'
const URL = process.env.BASE_URL ?? 'https://localhost:7126/swagger/index.html'

export const register = async (RegisterUser: any) => {
   return axios.post(`${URL}/auth/register`, RegisterUser)
 }

 export const login = async (LoginUser: any) => {
   return axios.post(`${URL}/auth/login`, LoginUser)
 }