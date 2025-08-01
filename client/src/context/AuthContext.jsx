import axios from "axios";
import { createContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
    const [user, setUser] = useState(null); // {role, token, userData, ...}
    const [loading, setLoading] = useState(false);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Login function for any role
    const login = async (role, credentials) => {
        setLoading(true);
        try {
            const { data } = await axios.post(`${backendUrl}/api/${role}/login`, credentials);
            if (data.success) {
                // For reception and other employee roles, we get employee data
                if (role === 'reception') {
                    // Fetch employee data after successful login
                    try {
                        const employeeData = await fetchEmployeeData(data.token, role);
                        const userData = {
                            role,
                            token: data.token,
                            ...employeeData
                        };
                        setUser(userData);
                        localStorage.setItem(`${role}Token`, data.token);
                        localStorage.setItem('userData', JSON.stringify(userData));
                    } catch (fetchError) {
                        console.error('Failed to fetch employee data:', fetchError);
                        // Fallback if employee data fetch fails
                        const userData = { role, token: data.token };
                        setUser(userData);
                        localStorage.setItem(`${role}Token`, data.token);
                        localStorage.setItem('userData', JSON.stringify(userData));
                    }
                } else if (role === 'admin') {
                    // For admin, we don't fetch employee data
                    const userData = {
                        role: 'admin',
                        token: data.token,
                        email: credentials.email // Store admin email
                    };
                    setUser(userData);
                    localStorage.setItem(`${role}Token`, data.token);
                    localStorage.setItem('userData', JSON.stringify(userData));
                } else {
                    // For other roles (accountant, management, mechanic)
                    try {
                        const employeeData = await fetchEmployeeData(data.token, role);
                        const userData = {
                            role,
                            token: data.token,
                            ...employeeData
                        };
                        setUser(userData);
                        localStorage.setItem(`${role}Token`, data.token);
                        localStorage.setItem('userData', JSON.stringify(userData));
                    } catch (fetchError) {
                        // Fallback if employee data fetch fails
                        const userData = { role, token: data.token };
                        setUser(userData);
                        localStorage.setItem(`${role}Token`, data.token);
                        localStorage.setItem('userData', JSON.stringify(userData));
                    }
                }
                toast.success("Login successful");
                setLoading(false);
                return true; // Return success
            } else {
                toast.error(data.message);
                setLoading(false);
                return false; // Return failure
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message || "Login failed");
            setLoading(false);
            return false; // Return failure
        }
    };

    // Function to fetch employee data (for reception and other employee roles)
    const fetchEmployeeData = async (token, role) => {
        try {
            // Use the correct header format based on role
            const config = {
                headers: {}
            };
            
            if (role === 'reception') {
                config.headers['rtoken'] = token;
            } else if (role === 'admin') {
                config.headers['atoken'] = token;
            } else if (role === 'mechanic') {
                config.headers['mtoken'] = token;
            } else if (role === 'accountant') {
                config.headers['Authorization'] = `Bearer ${token}`;
            } else if (role === 'manager') {
                config.headers['Authorization'] = `Bearer ${token}`;
                console.log('Using Authorization header for manager profile fetch');
            } else {
                // For other employee roles, use rtoken as default
                config.headers['rtoken'] = token;
            }
            
            
            // Fetch employee profile data from the backend
            const { data } = await axios.get(`${backendUrl}/api/${role}/profile`, config);
            
            
            if (data.success) {
                return {
                    id: data.employee._id,
                    firstName: data.employee.firstName,
                    lastName: data.employee.lastName,
                    email: data.employee.email,
                    phoneNumber: data.employee.phoneNumber,
                    address: data.employee.address,
                    gender: data.employee.gender,
                    image: data.employee.image,
                    role: data.employee.role
                };
            } else {
                throw new Error(data.message || 'Failed to fetch employee data');
            }
        } catch (error) {
            console.error('Error fetching employee data:', error);
            throw error;
        }
    };

    // Logout function
    const logout = () => {
        if (user) {
            // Handle role mismatch: 'receptionist' from DB vs 'reception' used for tokens
            const tokenRole = user.role === 'receptionist' ? 'reception' : user.role;
            localStorage.removeItem(`${tokenRole}Token`);
        }
        localStorage.removeItem('userData');
        setUser(null);
        toast.success("Logged out");
    };

    // Check for token on mount and restore session
    useEffect(() => {
        const restoreSession = async () => {
            const storedUserData = localStorage.getItem('userData');
            
            if (storedUserData) {
                try {
                    const userData = JSON.parse(storedUserData);
                    
                    // Handle role mismatch: 'receptionist' from DB vs 'reception' used for tokens
                    const tokenRole = userData.role === 'receptionist' ? 'reception' : userData.role;
                    const token = localStorage.getItem(`${tokenRole}Token`);
                    
                    
                    if (token) {
                        // Update user data with token to ensure it's available
                        const userDataWithToken = { ...userData, token }
                        
                        // If it's a reception user and we don't have complete profile data, fetch it
                        if ((userData.role === 'receptionist' || userData.role === 'reception') && (!userData.firstName || !userData.lastName)) {
                            try {
                                console.log('Fetching fresh profile data after page refresh...');
                                const employeeData = await fetchEmployeeData(token, 'reception'); // Always use 'reception' for API calls
                                const completeUserData = {
                                    ...userDataWithToken,
                                    ...employeeData
                                };
                                setUser(completeUserData);
                                localStorage.setItem('userData', JSON.stringify(completeUserData));
                                console.log('Profile data refreshed:', completeUserData);
                            } catch (fetchError) {
                                console.error('Failed to refresh profile data:', fetchError);
                                // Use stored data as fallback
                                setUser(userDataWithToken);
                            }
                        } else {
                            setUser(userDataWithToken);
                        }
                    }
                } catch (error) {
                    console.error('Error restoring session:', error);
                    // Clear invalid stored data
                    localStorage.removeItem('userData');
                    localStorage.clear(); // Clear all role tokens
                }
            } else {
                console.log('No stored user data found');
            }
        };

        restoreSession();
    }, []);

    const value = {
        user,
        setUser,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;