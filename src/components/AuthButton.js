import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa'; // Importe o ícone de perfil

const AuthButton = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(); // Redireciona o usuário para a página inicial após o logout
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {user ? (
        <>
          {user.imgurl ? (
            <img src={user.imgurl} alt="User Avatar" style={{ borderRadius: '50%', width: '40px', height: '40px', marginRight: '10px' }} />
          ) : (
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                marginRight: '10px',
              }}
            />
          )}
          <span>{user.username}</span>
          {/* Adicione o botão de perfil com o ícone */}
          <Link to="/profile" style={{ marginLeft: '10px' }}>
            <FaUser />
          </Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </div>
  );
};

export default AuthButton;
