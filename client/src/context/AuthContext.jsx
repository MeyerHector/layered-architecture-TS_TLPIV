import {
  createContext,
  useState,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { registerRequest, loginRequest, verifyTokenRequest } from "../api/auth";
import { authReducer } from "./AuthReducer";
export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [errors, setErrors] = useState([]);
  const token = localStorage.getItem("token");
  const initialState = {
    user: {},
    token: token ? token : null,
    isLogged: false,
  };

  const [authState, dispatch] = useReducer(authReducer, initialState);
  const validateToken = async (token) => {
    const res = await verifyTokenRequest(token);
    if (res.status !== 200) {
      localStorage.removeItem("token");
      dispatch({ type: "LOGOUT" });
      return;
    }

    dispatch({
      type: "LOGIN",
      payload: {
        user: res.data.user,
        token: res.data.token,
        isLogged: true,
      },
    });
  };

  const signup = async (user) => {
    const res = await registerRequest(user);

    if (res.status !== 200) {
      return setErrors(["Error al iniciar sesión"]);
    }
    if (res.data.token && res.data.user) {
      dispatch({
        type: "LOGIN",
        payload: {
          user: res.data.user,
          token: res.data.token,
          isLogged: true,
        },
      });

      localStorage.setItem("token", res.data.token);
    } else {
      setErrors(["Error: Token o datos de usuario no encontrados"]);
    }
  };

  const signin = async (userData) => {
    try {
      const res = await loginRequest(userData);
      if (res.status !== 200) {
        return setErrors(["Error: Token no encontrado"]);
      }
      dispatch({
        type: "LOGIN",
        payload: {
          user: res.data.user,
          token: res.data.token,
          isLogged: true,
        },
      });
      localStorage.setItem("token", res.data.token);
    } catch (error) {
      setErrors(error.response?.data || ["Error en el inicio de sesión"]);
    }
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("token");
    navigate("/rs");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrors([]);
    }, 3000);
    return () => clearTimeout(timer);
  }, [errors]);

  useEffect(() => {
    if (token) validateToken(token);
  }, [token]);

  return (
    <AuthContext.Provider value={{ signup, signin, logout, authState, errors }}>
      {children}
    </AuthContext.Provider>
  );
};
