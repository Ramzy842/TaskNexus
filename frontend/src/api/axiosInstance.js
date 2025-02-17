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
    if (error.response?.status === 401 && !req._retry) {
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
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(req);
        } catch (refreshError) {
            console.log("Refresh Error: ", refreshError);
            console.error("Refresh token expired. Logging out...");
            localStorage.removeItem("accessToken");
            window.location.href = "/login";
            return Promise.reject(refreshError);
        }
    }

    return Promise.reject(error);

})

export default api;
