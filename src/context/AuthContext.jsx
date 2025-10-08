import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Fetch user profile on mount if token exists
  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
      } else {
        // Token invalid, clear it
        logout();
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (googleToken) => {
    try {
      const response = await fetch(`${API_URL}/api/users/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: googleToken })
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const updatePreferences = async (preferences) => {
    try {
      const response = await fetch(`${API_URL}/api/users/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(preferences)
      });

      const data = await response.json();

      if (response.ok) {
        setUser({ ...user, preferences: data.preferences });
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error('Update preferences error:', error);
      return { success: false };
    }
  };

  const addMatch = async (company) => {
    try {
      const response = await fetch(`${API_URL}/api/users/matches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          companyId: company.id || company._id,
          matchScore: company.matchScore,
          matchReason: company.matchReason
        })
      });

      const data = await response.json();

      if (response.ok) {
        setUser({ ...user, matches: data.matches });
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error('Add match error:', error);
      return { success: false };
    }
  };

  const addPass = async (companyId) => {
    try {
      const response = await fetch(`${API_URL}/api/users/passes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ companyId })
      });

      const data = await response.json();

      if (response.ok) {
        setUser({ ...user, passedCompanies: data.passedCompanies });
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error('Add pass error:', error);
      return { success: false };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAuthenticated: !!user,
      login,
      logout,
      updatePreferences,
      addMatch,
      addPass,
      fetchUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
