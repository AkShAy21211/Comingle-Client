import axios, { InternalAxiosRequestConfig } from "axios";
import { SignedInAdmin } from "../Interface/interface";
const axiosInstance = axios.create({
  baseURL: "http://13.201.34.214:5000",
  withCredentials: true,
});
let data = localStorage.getItem("admin");
console.log(import.meta.env);

const admin: SignedInAdmin = data ? JSON.parse(data) : null;

const authFreeEndpoints = ["/admin/login"];
// List of prefixes for endpoints that don't require authorization

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Set Content-Type header conditionally
    console.log("mp data", config);

    if (config.data && config.data instanceof FormData) {
      console.log("confgigggg form datra", config.data);

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
      if (admin) {
        config.headers["Authorization"] = `Bearer ${admin?.token}`;
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
