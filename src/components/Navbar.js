// Navbar.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { LuLogOut } from "react-icons/lu";
import NavbarAdmin from "../admin/NavbarAdmin";

const Navbar = ({ user, onLogout }) => {
  const [showNavbarAdmin, setShowNavbarAdmin] = useState(false);

  const handleAdminClick = () => {
    setShowNavbarAdmin(true);
  };

  const handleReturnToNormalNavbar = () => {
    setShowNavbarAdmin(false);
  };

  return (
    <nav className="bg-gray-700 border-b border-gray-900 p-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="mr-4 flex gap-1">
              <img src={require("./logo.png")} alt="Logo" className="h-8" />{" "}
              {/* Use a imagem como um elemento img */}
              <p className="text-white mt-0.5 font-semibold">NBATracker</p>
            </Link>
          </div>
          <div>
            <ul className="flex gap-4 justify-center text-white">
              {user && (
                <>
                  <li className="hover:underline">
                    <Link to="/">Home</Link>
                  </li>
                  <li className="hover:underline">
                    <Link to="/api">API</Link>
                  </li>
                  <li className="hover:underline">
                    <Link to="/teams">Teams</Link>
                  </li>
                  <li className="hover:underline">
                    <Link to="/season-games">Season Games</Link>
                  </li>
                  <li className="hover:underline">
                    <Link to="/day-games">Day Games</Link>
                  </li>
                  <li className="hover:underline">
                    <Link to="/players">Players</Link>
                  </li>
                  <li className="hover:underline">
                    <Link to="/standings">Standings</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="text-white font-semibold">{user.username}</span>
                <button
                  onClick={onLogout}
                  className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm px-4 flex gap-1"
                >
                  <LuLogOut className="mt-0.5 w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mr-2"
                >
                  Entrar
                </Link>
              </>
            )}
            {user && user.rolesid === 1 && (
              <>
                <button
                  onClick={handleAdminClick}
                  className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm px-4 flex gap-1"
                >
                  <MdOutlineAdminPanelSettings className="h-4 w-4 mt-0.5" />
                  Admin
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {showNavbarAdmin && (
        <NavbarAdmin
          user={user}
          onLogout={onLogout}
          onReturnToNormalNavbar={handleReturnToNormalNavbar}
        />
      )}
    </nav>
  );
};

export default Navbar;
