import axios from "axios";

const axiosBase = axios.create({
  baseURL: "https://evangadiforum-backend-5-o8xh.onrender.com/api",
});

export default axiosBase;
