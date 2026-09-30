// src/apis/client.ts
import { notifications } from "@mantine/notifications";
import axios from "axios";
import useAuthStore from "@/stores/auth";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
});

/**
 * Request Interceptor
 */
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/**
 * Response Interceptor
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    notifications.show({
      color: "red",
      title: "錯誤",
      message: "系統發生錯誤，請稍後再試",
    });

    return Promise.reject(error);
  },
);

export default apiClient;
