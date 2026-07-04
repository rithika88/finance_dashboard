import axios from "axios";

const API_URL = "http://localhost:8000/api";

export const signup = (name, email, password) =>
  axios.post(`${API_URL}/auth/signup`, { name, email, password }).then(res => res.data);

export const login = (email, password) =>
  axios.post(`${API_URL}/auth/login`, { email, password }).then(res => res.data);
