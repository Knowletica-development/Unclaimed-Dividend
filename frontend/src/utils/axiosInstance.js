import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

const plainAxios = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const getRetryDelay = (attempt) => RETRY_DELAY * Math.pow(2, attempt - 1);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ config, resolve, reject }) => {
    if (error) reject(error);
    else {
      if (token) config.headers.Authorization = `Bearer ${token}`;
      resolve(axiosInstance(config));
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    if (error.response?.status === 401 && !config._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ config, resolve, reject });
        });
      }

      config._retry = true;
      isRefreshing = true;

      try {
        const response = await plainAxios.post("/user/refresh-token");
        if (response.data.success) {
          const newToken = response.data.accessToken;
          processQueue(null, newToken);
          config.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(config);
        } else {
          processQueue(new Error("Refresh failed"), null);
          return Promise.reject(new Error("Refresh failed"));
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (!config || (config.__retryCount || 0) >= MAX_RETRIES)
      return Promise.reject(error);

    const isRetryable =
      !error.response ||
      error.response.status >= 500 ||
      error.code === "ECONNABORTED" ||
      error.code === "NETWORK_ERROR";

    if (!isRetryable) return Promise.reject(error);

    config._retryCount = (config._retryCount || 0) + 1;
    const delay = getRetryDelay(config.__retryCount);
    await new Promise((resolve) => setTimeout(resolve, delay));

    return axiosInstance(config);
  }
);

export default axiosInstance;
