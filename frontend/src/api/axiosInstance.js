import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:4000/api",
    withCredentials: true
})

api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken && (config.url.startsWith("/tasks") || config.url.startsWith("/users") || config.url.startsWith("/auth/logout"))) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(response => response, async (error) => {
    const req = error.config;
    console.log(error.response.data.error);
    if (error.response.data.error === "Token expired" && !req._retry) {
        req._retry = true;
        try {
            const refreshResponse = await axios.post(
                "http://localhost:4000/api/auth/refresh",
                {},
                { withCredentials: true }
            );
            const newAccessToken = refreshResponse.data.accessToken;
            localStorage.setItem("accessToken", newAccessToken);
            api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
            req.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(req);
        } catch (refreshError) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("id");
            window.location.href = "/login";
            return Promise.reject(refreshError);
        }
    }

    return Promise.reject(error);

})

export default api;
