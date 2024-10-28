import { createContext, useState, useContext, useEffect } from "react";
import { registerRequest, loginRequest, verifyTokenRequest } from "../api/auth";
import Cookies from "js-cookie";

export const AuthContext = createContext();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider ");
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
      console.log("Datos de usuario:", res.data.user);
      console.log("Token en signup:", res.data.token);

      const token = res.data.token;
      if (token) {
        setUser(res.data.user);
        setIsAuthenticated(true);
        Cookies.set("token", token);
      } else {
        console.error("Token no encontrado en la respuesta de registro");
      }
    } catch (error) {
      console.log("Error en signup:", error.response);
      setErrors(error.response?.data || ["Error en el registro"]);
    }
  };

  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      console.log("Respuesta completa:", res);
      console.log("Datos de la respuesta:", res.data);
      console.log("Token:", res.data.user.token);

      if (res.data && res.data.user && res.data.user.token) {
        setUser(res.data.user);
        setIsAuthenticated(true);
        Cookies.set("token", res.data.user.token);
      } else {
        console.error("Token no encontrado en la respuesta");
      }
    } catch (error) {
      console.log(error.response);
      setErrors(
        Array.isArray(error.response?.data)
          ? error.response.data
          : [error.response?.data.message]
      );
    }
  };

  const logout = () => {
    Cookies.remove("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  useEffect(() => {
    async function checkLogin() {
      const cookies = Cookies.get();
      if (!cookies.token) {
        setIsAuthenticated(false);
        setLoading(false);
        return setUser(null);
      }

      try {
        const res = await verifyTokenRequest(cookies.token);
        if (!res.data) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
        setIsAuthenticated(true);
        setUser(res.data);
      } catch (error) {
        console.log(error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

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
