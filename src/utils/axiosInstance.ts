// import axios from "axios";

// // Create a single axios instance
// const axiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
//   withCredentials: true, // send cookies on every request
// });

// // ✅ Response interceptor for token refresh
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // If token expired and not retried yet
//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
//       !originalRequest.url.includes("/auth/refresh-token")
//     ) {
//       originalRequest._retry = true;
//       try {
//         // Try refreshing token
//         await axiosInstance.post("/auth/refresh-token", {});
//         // Retry the original request
//         return await axiosInstance(originalRequest);
//       } catch (refreshError) {
//         console.error("Token refresh failed:", refreshError);
//         // If refresh fails, clear cookies and redirect to login (handled in AuthContext)
//       }
//     }

//     return Promise.reject(error);
//   },
// );

// export default axiosInstance;




import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
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