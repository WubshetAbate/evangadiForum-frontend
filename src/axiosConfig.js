import axios from "axios";

const axiosBase = axios.create({
  baseURL: "https://evangadiforum-backend-4-7619.onrender.com/api",
});

export default axiosBase;
