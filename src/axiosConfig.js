import axios from "axios";

const axiosBase = axios.create({
  //baseURL: "http://localhost:5500/api",
  baseURL: "https://evangadiforum-backend-8hzn.onrender.com"
  //headers: {
    //"Content-Type": "application/json",
  //},
});

export default axiosBase;
