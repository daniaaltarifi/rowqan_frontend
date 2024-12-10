
import axios from 'axios';
import React, { createContext, useState, useContext } from 'react';
import { API_URL } from '../App';

// Create Context
const UserContext = createContext();

// Create a custom hook to access the UserContext
export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null); // Initialize userId state

  // You can fetch the user ID when the app loads (e.g., from cookies or API)
  const fetchUserId = async () => {

    try {
      const response = await axios.get(`${API_URL}/users/verifytoken`, {
        withCredentials: true,
      });
      setUserId(response.data.userId); // Store the user ID in global state
    } catch (error) {
      console.log("Error fetching user ID:", error);
    }
  };
  const logout = async () => {
    try {
      await axios.post(`${API_URL}/users/logout`, {}, { withCredentials: true });
      setUserId(null);  // Remove userId after logout
    } catch (error) {
      console.error('Logout error', error);
    }
  };
  // Fetch user data when the component mounts
  React.useEffect(() => {
    fetchUserId();
  }, [fetchUserId]);

  return (
    <UserContext.Provider value={{ userId, setUserId,logout }}>
      {children}
    </UserContext.Provider>
  );
};
