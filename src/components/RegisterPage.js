import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../services/AuthService';
import Logo from './logo.png'; // Importe o componente de logotipo

const RegisterPage = ({ onRegister }) => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      navigate('/');
    } catch (error) {
      console.error('Erro ao registrar:', error.message);
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="max-w-md px-6 py-8 bg-white shadow-md rounded-md">
        <img src={Logo} alt="Logo" className="w-20 mx-auto mb-6" />
        <h1 className="text-2xl font-semibold mb-4">Registro</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500">{error}</p>}
          <div>
            <label htmlFor="email" className="block">E-mail:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="username" className="block">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
          <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Registrar</button>
        </form>
        <div className="mt-4 text-center">
          Já tem uma conta? <Link to="/login" className="text-blue-500">Faça login</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
