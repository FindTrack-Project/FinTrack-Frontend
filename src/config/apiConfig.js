import axios from "axios";

const BASE_URL = "https://fintrackcapstone.vercel.app/api";

const Api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default Api;
