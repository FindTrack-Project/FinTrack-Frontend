import axios from "axios";

const BASE_URL = "https://fintrackcapstone.vercel.app/api";

const Api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Tambahkan interceptor untuk Authorization JWT
Api.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default Api;
