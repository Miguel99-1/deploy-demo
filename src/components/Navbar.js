// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import AuthButton from './AuthButton'; // Importe o componente AuthButton

const Navbar = ({ user, onLogout }) => {
  return (
    <div>
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
          {/* Renderize o AuthButton como um item de navegação */}
          <li>
            <AuthButton user={user} onLogout={onLogout} />
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
