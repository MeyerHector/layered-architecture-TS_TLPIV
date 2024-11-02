import axios from "./axios.js";

export const registerRequest = (user) => axios.post(`/api/auth/register`, user);

export const loginRequest = (user) => axios.post(`/api/auth/login`, user);

export const verifyTokenRequest = async () => {
    return await axios.get(`/api/auth/verify`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    })
};
