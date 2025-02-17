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

const create = (payload) => request("post", "/tasks", payload)
const get = async (id) => request("get", `/tasks/${id}`);
const update = async (id, payload) => request("put", `/tasks/${id}`, payload);
const remove = async (id) => request("delete", `/tasks/${id}`)

export { create, get, remove, update }