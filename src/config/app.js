import axios from "axios";
import {apiUrlBase} from "./env.js";


export const api = axios.create({
    baseURL: `${apiUrlBase}`,
    withCredentials: true,
})