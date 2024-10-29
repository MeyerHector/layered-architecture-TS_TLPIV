import { createContext, useState, useContext, useEffect } from "react";
import { registerRequest, loginRequest, verifyTokenRequest } from "../api/auth";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      console.log("Respuesta completa de signup:", res);

      const token = res.data?.token; 
      const userData = res.data?.user;
      if (token && userData) {
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem("token", token);
        console.log("Token almacenado:", token);
      } else {
        setErrors(["Error: Token o datos de usuario no encontrados"]);
      }
    } catch (error) {
      console.log("Error en signup:", error.response);
      setErrors(error.response?.data || ["Error en el registro"]);
    }
  };

  const signin = async (userData) => {
    try {
      const res = await loginRequest(userData);
      console.log("Respuesta de inicio de sesión:", res.data);

      const token = res.data?.user?.token; 
      if (token) {
        setUser(res.data.user);
        setIsAuthenticated(true);
        localStorage.setItem("token", token);
        console.log("Token almacenado:", token);
      } else {
        setErrors(["Error: Token no encontrado"]);
      }
    } catch (error) {
      console.error("Error en signin:", error.response);
      setErrors(error.response?.data || ["Error en el inicio de sesión"]);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
    navigate("/rs");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrors([]);
    }, 3000);
    return () => clearTimeout(timer);
  }, [errors]);

  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await verifyTokenRequest(token);
        console.log("Respuesta de verificación de token:", res.data);

        if (res.data && res.data.user) {
          setIsAuthenticated(true);
          setUser(res.data.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.log("Error en la verificación del token:", error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{ signup, signin, logout, loading, user, isAuthenticated, errors }}
    >
      {children}
    </AuthContext.Provider>
  );
};
