import axios from 'axios'
import keycloak from './keycloak'

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

api.interceptors.request.use(
    async (config) => {
        if (keycloak.token) {
            config.headers.Authorization = `Bearer ${keycloak.token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

export default api
