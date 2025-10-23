import axios from "axios";

const axiosBase = axios.create({
  baseURL: "https://evangadiforum-backend-3-t6ny.onrender.com/api",
});

export default axiosBase;
