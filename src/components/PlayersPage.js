// PlayersPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from '../services/AuthService.js'; // Importe o useAuth

const PlayersPage = (user) => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/players");
        setPlayers(response.data);
      } catch (error) {
        console.error("Erro ao obter dados dos jogadores:", error);
      }
    };

    const fetchTeams = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/equipas");
        setTeams(response.data);
      } catch (error) {
        console.error("Erro ao obter dados das equipas:", error);
      }
    };

    fetchPlayers();
    fetchTeams();
  }, []);

  const handleTeamChange = (event) => {
    setSelectedTeam(event.target.value);
  };

  const handleEditPlayer = async (player) => {
    try {
      await axios.put(`http://localhost:8000/api/players/${player.PlayerID}`, player);
      console.log("Jogador atualizado com sucesso:", player);
    } catch (error) {
      console.error("Erro ao atualizar jogador:", error);
    }
  };

  const handleDeletePlayer = async (playerId) => {
    try {
      await axios.delete(`http://localhost:8000/api/players/${playerId}`);
      console.log("Jogador excluído com sucesso:", playerId);
    } catch (error) {
      console.error("Erro ao excluir jogador:", error);
    }
  };

  return (
    <div>
      <h1>NBA Players List</h1>

      <label htmlFor="teamSelect">Selecionar Equipe: </label>
      <select
        id="teamSelect"
        value={selectedTeam}
        onChange={handleTeamChange}
      >
        <option value="">Todas as Equipes</option>
        {teams.map((team) => (
          <option key={team.TeamID} value={team.TeamName}>
            {team.TeamName}
          </option>
        ))}
      </select>

      <ul id="playersList">
        {players.map((player) => (
          <li key={player.PlayerID} className="player">
            <strong>{`${player.FirstName} ${player.LastName}`}</strong> -{" "}
            {`${player.Position}, Team: ${player.TeamName}`}
            {user && user.rolesid === 1 && ( // Verifica o rolesid do usuário
              <div>
                <button onClick={() => handleEditPlayer(player)}>Editar</button>
                <button onClick={() => handleDeletePlayer(player.PlayerID)}>Excluir</button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div id="playerCount" style={{ textAlign: "center", marginTop: "20px" }}>
        Total de jogadores: {players.length}
      </div>
    </div>
  );
};


export default PlayersPage;
