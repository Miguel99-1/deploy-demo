// Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  NavbarContainer,
  NavList,
  NavItem,
  NavLink,
  LogoutButton,
} from "./NavbarAdminStyles";

const NavbarAdmin = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <NavbarContainer>
      <div>
        <Link to="/">
          <img
            src="https://placehold.it/50x50" // Substitua pela URL do seu logotipo
            alt="Logo"
            style={{ marginRight: "10px" }}
          />
        </Link>
        <span style={{ color: "#fff", fontSize: "20px", fontWeight: "bold" }}>
          Nome do Seu Site
        </span>
      </div>
      <NavList>
        {/* Adicione mais itens de navegação conforme necessário */}
        {user && (
          <>
            <NavLink as={Link} to="/">
              User
            </NavLink>
            <NavItem>
              <NavLink as={Link} to="/datadisplay">
                Players
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink as={Link} to="/season-games">
                Season Games
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink as={Link} to="/day-games">
                Day Games
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink as={Link} to="/players">
                Players na Bd
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink as={Link} to="/standings">
                Standings na bd
              </NavLink>
            </NavItem>
          </>
        )}
      </NavList>
      <NavList>
        <NavItem>
          <NavLink as={Link} to="/admin">
            Admin
          </NavLink>
        </NavItem>
      </NavList>
      <div style={{ display: "flex", alignItems: "center" }}>
        {user ? (
          <>
            {user.imgurl ? (
              <img
                src={user.imgurl}
                alt="User Avatar"
                style={{
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  marginRight: "10px",
                }}
              />
            ) : (
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#ccc",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
            )}
            <span style={{ color: "#fff", marginRight: "10px" }}>
              {user.email}
            </span>
            <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
          </>
        ) : (
          <NavLink as={Link} to="/login">
            Login
          </NavLink>
        )}
      </div>
    </NavbarContainer>
  );
};

export default NavbarAdmin;
