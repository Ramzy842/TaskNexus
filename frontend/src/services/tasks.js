import api from "../api/axiosInstance"

const request = async (method, url, payload = null) => {
    try {
        const res = await api[method](url, payload);
        return res.data;
    }
    catch (error) {
        console.error(`Error in ${method.toUpperCase()} ${url}:`, error);
        throw error;
    }
}

const createTask = (payload) => request("post", "/tasks", payload)
const getTask = async (id) => request("get", `/tasks/${id}`);
const updateTask = async (id, payload) => request("put", `/tasks/${id}`, payload);
const removeTask = async (id) => request("delete", `/tasks/${id}`)

export { createTask, getTask, removeTask, updateTask }