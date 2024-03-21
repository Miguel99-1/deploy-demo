import React from 'react';

const ProfilePage = ({ user }) => {
  return (
    <div>
      <h1>Perfil do Usuário</h1>
      {user ? (
        <div>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Password:</strong> {user.password} </p>
          {/* Adicione mais informações do perfil conforme necessário */}
        </div>
      ) : (
        <p>Você não está logado.</p>
      )}
    </div>
  );
};

export default ProfilePage;
