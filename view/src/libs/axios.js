import axios from "axios"

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : "http://localhost:11000/api",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Request interceptor
axiosInstance.interceptors.request.use(
    config => {
        console.log(`Sending ${config.method.toUpperCase()} request to: ${config.url}`);
        
        // Special handling for multipart/form-data
        if (config.data instanceof FormData) {
            console.log('FormData detected - removing Content-Type header to let browser set it');
            // Let the browser set the Content-Type header with boundary for FormData
            delete config.headers['Content-Type'];
        }
        
        return config;
    },
    error => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    response => {
        console.log(`Response from ${response.config.url}: Status ${response.status}`);
        return response;
    },
    error => {
        if (error.response) {
            console.error(`Response error ${error.response.status} from ${error.config?.url}:`, error.response.data);
            
            // Handle 401 unauthorized errors (token expired or invalid)
            if (error.response.status === 401) {
                console.log('Authentication error detected - user may need to login again');
                // Could redirect to login or clear auth state here
            }
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error setting up request:', error.message);
        }
        
        return Promise.reject(error);
    }
);