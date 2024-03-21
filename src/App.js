// App.js
import React, { useState, useEffect } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useNavigate
} from 'react-router-dom';
import NavbarAdmin from './admin/NavbarAdmin';
import StandingsAdmin from './admin/StandingsAdmin';
import downloadpage from './downloadpage';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import ApiPage from './components/ApiPage';
import ProfilePage from './components/ProfilePage';
import LandingPage from './components/LandingPage';
import TeamsPage from './components/TeamsPage';
import PlayersPage from './components/PlayersPage';
import SeasonGamesPage from './components/SeasonGamesPage';
import DayGamesPage from './components/DayGamesPage';
import SeasonGames from './admin/SeasonGames';
import DayGames from './admin/DayGames';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import { AuthProvider, useAuth } from './services/AuthService';
import StandingsPage from './components/StandingsPage';
import GlobalStyles from './GlobalStyles';
import PlayersStatsPage from './components/PlayersStatsPage';
import AdminPage from './admin/AdminPage';
import DataDisplay from './admin/DataDisplay';
import Teams from './admin/Teams';
import Stadiums from './admin/Stadiums';
import TeamDetailsPage from './components/TeamDetailsPage'; 

const App = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const { login, register } = useAuth();

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
    navigate('/landing');
  };

  useEffect(() => {
    if (user && user.rolesid === 1) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/landing" element={<LandingPage user={user} />} />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
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
        <Route
          path="/"
          element={
            user && isAdmin ? (
              <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/landing" replace />
            )
          }
        />
        <Route path="/api" element={<ApiPage />} />
        <Route path="/admin" element={<AdminPage user={user}/>} />
        <Route path="/standingsadmin" element={<StandingsAdmin user={user}/>} />
        <Route path="/profile" element={<ProfilePage user={user} />} />
        <Route path="/datadisplay" element={<DataDisplay user={user}/>} />
        <Route path="/teamsadmin" element={<Teams user={user}/>} />
        <Route path="/seasongames" element={<SeasonGames />} />
        <Route path="/daygames" element={<DayGames user={user} />} />
        <Route path="/players" element={<PlayersPage user={user} />} />
        <Route path="/stadiums" element={<Stadiums />} />
        <Route path="/download" element={<downloadpage />} />
        <>
          <Route path="/teams" element={<TeamsPage user={user} />} />
          <Route path="/season-games" element={<SeasonGamesPage user={user} />} />
          <Route path="/day-games" element={<DayGamesPage user={user}/>} />
          <Route path="/playersstats" element={<PlayersStatsPage user={user} />} />
          <Route path="/standings" element={<StandingsPage user={user} />} />
          <Route path="/team/:id" element={<TeamDetailsPage user={user} />} />
        </>
        <Route path="*" element={<><div>Página não encontrada</div><link href='/landing'>Volte para a página inicial</link></>} />
      </Routes>
    </>
  );
};

const AuthenticatedApp = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AuthenticatedApp;
