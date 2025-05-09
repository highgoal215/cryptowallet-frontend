import axios from 'axios';

const Backend_Url = 'http://localhost:5000/api';

export const Login = async (email: string, password: string) => {

    // If no mock match, try the actual API (this will fail in demo mode)
    try {
        const response = await axios.post(`${Backend_Url}/login`, {
            email,
            password,
        }, {
            withCredentials: true
        });

        const token = response.data.token;
        localStorage.setItem('token', token);

        return response.data;
    } catch (error: any) {
        console.error('Login Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Login failed');
    }
};

export const SignUp = async (username: string, email: string, password: string) => {
    try {
        const response = await axios.post(`${Backend_Url}/signup`, {
            username,
            email,
            password,
        }, {
            withCredentials: true
        });

        const token = response.data.token;
        localStorage.setItem('token', token);

        return response.data;
    } catch (error: any) {
        console.error('Signup Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Signup failed');
    }
};

export const Logout = async () => {
    try {
        const token = localStorage.getItem('token');

        await axios.post(`${Backend_Url}/api/logout`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        console.error('Logout API call failed', error);
    } finally {
        localStorage.removeItem('token');
    }
};
