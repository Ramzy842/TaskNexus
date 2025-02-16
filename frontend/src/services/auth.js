import axios from 'axios'
import api from '../api/axiosInstance';
const baseUrl = 'http://localhost:4000/api'

const signup = async (username, email, name, password) => {
    const res = await api.post(`${baseUrl}/users`, { username, email, name, password });
    return res;
}

const login = async (email, password) => {
    const res = await api.post(`${baseUrl}/auth/login`, { email, password });
    return res;
}

const logout = async () => {
    const res = await api.post(`${baseUrl}/auth/logout`, { email, password });
    return res;
}

const getRefreshToken = () => {
    
}

export default { signup, login, logout, getRefreshToken }