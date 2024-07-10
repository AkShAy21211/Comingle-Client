import axios, { InternalAxiosRequestConfig } from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URI;

const axiosInstance = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
});


const currentUser = localStorage.getItem("user");

const user = currentUser ? JSON.parse(currentUser) : null;

let token = localStorage.getItem("token");

token = token ? JSON.parse(token) : null;


const authFreeEndpoints = [
  "/user/signup",
  "/user/signup/verify-otp",
  "/user/signup/verify-otp/resend",
  "/user/signin",
]; // List of prefixes for endpoints that don't require authorization

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {


    
    if (config.data && config.data instanceof FormData) {

      
      config.headers["Content-Type"] = "multipart/form-data";
    
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    // Set Authorization header conditionally
    const url = config.url || "";
    const requiresAuth = !authFreeEndpoints.some((endpoint) =>
      url.startsWith(endpoint)
    );

    
    if (requiresAuth) {
      console.log(requiresAuth);
      
      if (token|| user) {


        
        config.headers["Authorization"] = `Bearer ${user?.token||token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle response error
    if (error.response && error.response.status === 401) {
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
