import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NavbarAdmin from "./admin/NavbarAdmin";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import ApiPage from "./components/ApiPage";
import TeamsPage from "./components/TeamsPage";
import PlayersPage from "./components/PlayersPage";
import SeasonGamesPage from "./components/SeasonGamesPage";
import DayGamesPage from "./components/DayGamesPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import { AuthProvider, useAuth } from "./services/AuthService";
import StandingsPage from "./components/StandingsPage";
import GlobalStyles from "./GlobalStyles";
import PlayersStatsPage from "./components/PlayersStatsPage";
import AdminPage from './admin/AdminPage';
import DataDisplay from './admin/DataDisplay';
import Teams from './admin/Teams';
import Stadiums from './admin/Stadiums';

const App = () => {
  const [user, setUser] = useState(null);
  const [isAdmin] = useState(false);

  const { login, register } = useAuth();

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <>
      <GlobalStyles />
      <Router>
        {isAdmin ? (
          <NavbarAdmin user={user} onLogout={handleLogout} />
        ) : (
          <Navbar user={user} onLogout={handleLogout} />
        )}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/api" element={<ApiPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/datadisplay" element={<DataDisplay />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/players" element={<PlayersPage />} />
          <Route path="/stadiums" element={<Stadiums />} />
          <>
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/season-games" element={<SeasonGamesPage />} />
            <Route path="/day-games" element={<DayGamesPage />} />
            <Route path="/playersstats" element={<PlayersStatsPage />} />
            <Route path="/standings" element={<StandingsPage />} />
          </>
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/" replace />
              ) : (
                <LoginPage onLogin={login} />
              )
            }
          />
          <Route
            path="/register"
            element={
              user ? (
                <Navigate to="/" replace />
              ) : (
                <RegisterPage onRegister={register} />
              )
            }
          />
          <Route path="*" element={<div>Página não encontrada</div>} />
        </Routes>
      </Router>
    </>
  );
};

const AuthenticatedApp = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AuthenticatedApp;
