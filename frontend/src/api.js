import axios from 'axios'
const API = axios.create({ baseURL: 'http://localhost:4000' })
export function authHeader(token){ return { headers: { Authorization: `Bearer ${token}` } } }
export default API
