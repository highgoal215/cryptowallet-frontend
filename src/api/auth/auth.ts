import axios from 'axios';

const Backend_Url = 'http://localhost:5000/api';

export const Login = async (email: string, password: string) => {
    // For demo purposes, check against our mock users directly
    // This is a temporary solution to allow login with test credentials
    const mockUsers = [
      {
        id: "user-id",
        email: "user@email.com",
        username: "user",
        password: "user123",
        isAdmin: false
      },
      {
        id: "test-user-id",
        email: "test@example.com",
        username: "test",
        password: "test1234",
        isAdmin: true // Setting test user as admin
      }
    ];

    // Check if email is a username and find matching user
    const mockUser = mockUsers.find(u => 
      (u.email === email || u.username === email) && u.password === password
    );
    
    if (mockUser) {
      // Simulate successful response
      const token = "mock-token-" + Math.random();
      localStorage.setItem('token', token);
      
      return {
        success: true,
        userObject: mockUser,
        token
      };
    }

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
