// LoginPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../services/AuthService';

const LoginPage = ({ user, onLogin }) => {
  const [email, setEmail] = useState('');
  const [rolesid] = useState ('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userData = await login(email, password, rolesid);
      onLogin(userData);
      navigate('/players');
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {user && <p>User is logged in!</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">E-mail:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Entrar</button>
      </form>
      <div>
        Não tem uma conta? <Link to="/register">Registre-se</Link>
      </div>
    </div>
  );
};

export default LoginPage;