import api from '../api/axiosInstance';

const getUser = async (id) => {
    try {
        const res = await api.get(`/users/${id}`);
        return res.data;
    } catch (error) {
        return error.response.data;
    }
}

const updateUser = async (id) => {
    try {
        const res = await api.put(`/users/${id}`);
        return res.data;
    } catch (error) {
        return error.response.data;
    }
}

const deleteUser = async (id) => {
    try {
        const res = await api.delete(`/users/${id}`);
        return res.data;
    } catch (error) {
        return error.response.data;
    }
}

export {getUser, updateUser, deleteUser }