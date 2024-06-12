import axios, { InternalAxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
  baseURL: "http://192.168.1.4:5000",
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
    // Set Content-Type header conditionally
    console.log('mp data',config);
    
    if (config.data && config.data instanceof FormData) {

      console.log('confgigggg form datra',config.data );
      
      config.headers["Content-Type"] = "multipart/form-data";
    
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    // Set Authorization header conditionally
    const url = config.url || "";
    const requiresAuth = !authFreeEndpoints.some((endpoint) =>
      url.startsWith(endpoint)
    );

    console.log(requiresAuth);
    
    if (requiresAuth) {
      console.log(requiresAuth);
      
      if (token|| user) {


        
        config.headers["Authorization"] = `Bearer ${user?.token||token}`;
      }
    }

    return config;
  },
  (error) => {
    // Handle request error
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
