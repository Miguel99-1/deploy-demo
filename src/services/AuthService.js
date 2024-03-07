// AuthService.js
import React, { createContext, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:8000/login', { email, password });
      return response.data; // Retornando a resposta completa
    } catch (error) {
      throw new Error('Erro ao autenticar: ' + error.message);
    }
  };

  const register = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:8000/register', { email, password });
      return response.data.user;
    } catch (error) {
      throw new Error('Erro ao registrar: ' + error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ login, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
