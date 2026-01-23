import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://blogspaneluat.omlogistics.co.in/api",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url.includes("/auth/refresh-token")) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      try {
        await axiosInstance.post("/auth/refresh-token");
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Trigger a hard redirect to login if refresh fails
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;