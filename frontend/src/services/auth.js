    import api from '../api/axiosInstance';

const signup = async (username, email, name, password) => {
    try {
        const res = await api.post(`/users`, { username, email, name, password });
        return res.data;
    } catch (error) {
        console.log("Error in signup: ", error);
        throw error;
    }
}

const login = async (email, password) => {
    try {
        const res = await api.post(`/auth/login`, { email, password });
        return res.data;
    } catch (error) {
        console.error("Error in login: ", error);
        throw error;
    }
}

const logout = async () => {
    try {
        const res = await api.post(`/auth/logout`);
        return res.data;
    } catch (error) {
        console.error("Error in logout: ", error);
        throw error;
    }
}

const getRefreshToken =  async () => {
    try {
        const res = await api.post(`/auth/refresh`);
        return res.data;
    } catch (error) {
        console.error("Error in refreshToken: ", error);
        throw error;
    }
}

export default { signup, login, logout, getRefreshToken }