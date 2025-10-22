import axios from "axios";

const axiosBase = axios.create({
  baseURL: "https://evangadiforum-backend-1-syd7.onrender.com/api", // Render deployment
});

export default axiosBase;
