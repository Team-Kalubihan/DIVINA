import { createContext, useState, useEffect, useContext } from 'react';
import { Auth, TokenStorage } from '../../API';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    (async () => {
      try {
        const token = await TokenStorage.getAccessToken();
        if (token) {
          const data = await Auth.me();
          setUser(data.user);
          setIsLoggedIn(true);
        }
      } catch {
        await TokenStorage.clearTokens();
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    try {
      await Auth.logout();
    } catch {
      // ignore errors on logout
    }
    await TokenStorage.clearTokens();
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isLoading, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}