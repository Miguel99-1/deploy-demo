import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = ({ onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Chama a função onRegister passando as credenciais
      
      // Redireciona para a página inicial após o registro bem-sucedido
      navigate('/');
    } catch (error) {
      setError(error.message || 'Erro ao registrar');
    }
  };

  return (
    <div>
      <h1>Registro</h1>
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
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
        <button type="submit">Registrar</button>
      </form>
      
      {/* Adiciona um botão/link para a página de login */}
      <div>
        Já tem uma conta? <Link to="/login">Faça login</Link>
      </div>
    </div>
  );
};

export default RegisterPage;
