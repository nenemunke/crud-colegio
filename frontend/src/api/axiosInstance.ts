import axios from "axios";

// Esta es la dirección de tu backend que probamos con Thunder Client
const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
