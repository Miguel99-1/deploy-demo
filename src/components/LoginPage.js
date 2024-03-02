import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../services/AuthService';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault(); // Impedir o envio padrão do formulário

    try {
      // Realizar o login
      const userData = await login(email, password);
      
      // Verificar se o login foi bem-sucedido e redirecionar para a página de players
      if (userData) {
        navigate('/players');
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div>
      <h1>Login</h1>
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
      
      {/* Adiciona um botão/link para a página de registro */}
      <div>
        Não tem uma conta? <Link to="/register">Registre-se</Link>
      </div>
    </div>
  );
};

export default LoginPage;
