    import api from '../api/axiosInstance';

const signup = async (username, email, name, password) => {
    try {
        const res = await api.post(`/users`, { username, email, name, password });
        return res.data;
    } catch (error) {
        return error.response.data;
    }
}

const login = async (email, password) => {
    try {
        const res = await api.post(`/auth/login`, { email, password });
        return res.data;
    } catch (error) {
        return error.response.data;
    }
}

const logout = async () => {
    try {
        const res = await api.post(`/auth/logout`);
        return res.data;
    } catch (error) {
        return error.response.data;
    }
}

const getRefreshToken =  async () => {
    try {
        const res = await api.post(`/auth/refresh`);
        return res.data;
    } catch (error) {
        return error.response.data;
    }
}

export { signup, login, logout, getRefreshToken }