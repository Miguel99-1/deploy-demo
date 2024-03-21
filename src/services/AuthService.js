// AuthService.js

import React, { createContext, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const login = async (emailOrUsername, password) => {
    try {
      const response = await axios.post("http://localhost:8000/login", {
        emailOrUsername,
        password,
      });
      return response.data; // Retornando a resposta completa
    } catch (error) {
      throw new Error("Erro ao autenticar: " + error.message);
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await axios.post("http://localhost:8000/register", {
        username,
        email,
        password,
      });
      const user = response.data.user;
      return user;
    } catch (error) {
      throw new Error("Erro ao registrar: " + error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ login, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;