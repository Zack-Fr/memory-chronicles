import axios from 'axios'

// Base URL of Laravel API
const API_BASE_URL = import.meta.env.VITE_API_URL

const apiClient = axios.create({
baseURL: API_BASE_URL,
headers: {
    'Content-Type': 'application/json',
},
})
apiClient.defaults.headers.common['Accept']       = 'application/json'
apiClient.defaults.headers.post['Content-Type']   = 'application/json'
// Intercept every request and inject the JWT from localStorage
apiClient.interceptors.request.use(config => {
const token = localStorage.getItem('token')
if (token) {
    config.headers.Authorization = `Bearer ${token}`
}
return config
})

export default apiClient
