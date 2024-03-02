import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { NavbarContainer, NavList, NavItem, NavLink, LogoutButton } from "./NavbarStyles";

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <NavbarContainer>
      <div>
        <Link to="/">
          <img src="https://placehold.it/50x50" alt="Logo" style={{ marginRight: "10px" }} />
        </Link>
        <span style={{ color: "#fff", fontSize: "20px", fontWeight: "bold" }}>
          Nome do Seu Site
        </span>
      </div>
      <NavList>
        <NavItem>
          <NavLink as={Link} to="/teams">
            Teams
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink as={Link} to="/season-games">
            Season Games
          </NavLink>
        </NavItem>
      </NavList>
      <div style={{ display: "flex", alignItems: "center" }}>
        {user ? (
          <>
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

export default Navbar;
