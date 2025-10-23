import axios from "axios";

const axiosBase = axios.create({
  baseURL: "https://evangadiforum-backend-2-huu0.onrender.com/api", 
});

export default axiosBase;
