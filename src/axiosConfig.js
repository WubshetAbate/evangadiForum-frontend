import axios from "axios";

const axiosBase = axios.create({
  baseURL: "https://evangadiforum-backend-8hzn.onrender.com/api", // add /api if backend uses it
});

export default axiosBase;
