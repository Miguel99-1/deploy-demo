// AuthButton.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AuthButton = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
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
          <span>{user.email}</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </div>
  );
};

export default AuthButton;
