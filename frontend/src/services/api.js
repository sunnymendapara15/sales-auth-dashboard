import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
const client = axios.create({
  baseURL: API_BASE_URL,
});

export const setAuthToken = (token) => {
  if (token) {
    client.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete client.defaults.headers.common.Authorization;
  }
};

export const login = (payload) => client.post('/auth/login', payload);
export const signup = (payload) => client.post('/auth/signup', payload);
export const fetchUsers = () => client.get('/users');
export const createUser = (payload) => client.post('/users', payload);
export const updateUser = (id, payload) => client.put(`/users/${id}`, payload);
export const deleteUser = (id) => client.delete(`/users/${id}`);

export default client;
