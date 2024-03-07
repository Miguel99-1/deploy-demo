// Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthButton from './AuthButton';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from '../admin/NavbarAdmin'; // Importe o NavbarAdmin

const Navbar = ({ user, onLogout }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showNavbarAdmin, setShowNavbarAdmin] = useState(false); // Estado para controlar a visibilidade da NavbarAdmin
  const navigate = useNavigate();

  const handleAdminClick = () => {
    setShowNavbarAdmin(true); // Mostra a NavbarAdmin quando clicar na AdminDashboard
    navigate('/admin');
  };

  const handleReturnToNormalNavbar = () => {
    setShowNavbarAdmin(false); // Esconde a NavbarAdmin e volta para a Navbar normal
    navigate('/');
  };


  return (
    <div>
      {!showNavbarAdmin && ( // Renderiza a Navbar apenas se showNavbarAdmin for false
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/api">API</Link>
          </li>
          <li>
            <Link to="/teams">Teams</Link>
          </li>
          <li>
            <Link to="/season-games">Season Games</Link>
          </li>
          <li>
            <Link to="/day-games">day Games</Link>
          </li>
          <li>
            <Link to="/players">Players</Link>
          </li>
          <li>
            <Link to="/standings">standings </Link>
          </li>
          <li>
            <AuthButton user={user} onLogout={onLogout} />
          </li>
          {user && user.rolesid === 1 && (
            <li>
              <button onClick={handleAdminClick}>AdminDashboard</button>
            </li>
          )}
        </ul>
      </nav>
      )}
      {showNavbarAdmin && (
        <NavbarAdmin
          user={user}
          onLogout={onLogout}
          onReturnToNormalNavbar={handleReturnToNormalNavbar} // Passa a função para retornar à Navbar normal para a NavbarAdmin
        />
      )}
    </div>
  );
};

export default Navbar;
