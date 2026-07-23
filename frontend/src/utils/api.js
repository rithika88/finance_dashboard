import axios from "axios";

const API_URL = "http://localhost:8000/api";

const authHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const getTransactions = () =>
  axios.get(`${API_URL}/transactions`, authHeader()).then(res => res.data);

export const createTransaction = (transaction) =>
  axios.post(`${API_URL}/transactions`, transaction, authHeader()).then(res => res.data);

export const updateTransaction = (id, transaction) =>
  axios.put(`${API_URL}/transactions/${id}`, transaction, authHeader()).then(res => res.data);

export const deleteTransaction = (id) =>
  axios.delete(`${API_URL}/transactions/${id}`, authHeader());

export const getInsights = () =>
  axios.get(`${API_URL}/insights`, authHeader()).then(res => res.data);

export const getAnalyticsInsights = () =>
  axios.get(`${API_URL}/insights/analytics`, authHeader()).then(res => res.data);

export const categorizeDescription = (description) =>
  axios.post(`${API_URL}/categorize`, { description }).then(res => res.data);

export const submitFeedback = (description, category) =>
  axios.post(`${API_URL}/feedback`, { description, category }, authHeader());
