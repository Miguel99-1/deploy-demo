import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../services/AuthService';
import Logo from './logo.png'; // Importe o componente de logotipo

const LoginPage = ({ setUser }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(emailOrUsername, password);
      if (response.token) {
        localStorage.setItem('token', response.token);
        setUser(response.user);
        navigate('/landing');
      } else {
        throw new Error('Token de autenticação não encontrado na resposta.');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error.message);
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="max-w-md px-6 py-8 bg-white shadow-md rounded-md">
        <img src={Logo} alt="Logo" className="w-20 mx-auto mb-6" />
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && <p className="text-red-500">{error}</p>}
          <div>
            <label htmlFor="emailOrUsername" className="block">E-mail ou Username:</label>
            <input
              type="text"
              id="emailOrUsername"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block">Senha:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Entrar</button>
        </form>
        <div className="mt-4 text-center">
          Não tem uma conta? <Link to="/register" className="text-blue-500">Registre-se</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
