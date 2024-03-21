import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../services/AuthService.js";

const PlayersPage = ({ user }) => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedEditTeam, setSelectedEditTeam] = useState("");
  const [selectedFilterTeam, setSelectedFilterTeam] = useState("");
  const [filteredPlayers, setFilteredPlayers] = useState([]); 
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [editFormData, setEditFormData] = useState({
    Equipas_id_Equipas: "",
    PlayerID: "",
    Status: "",
    TeamID: "",
    Team: "",
    Jersey: "",
    PositionCategory: "",
    Position: "",
    FirstName: "",
    LastName: "",
    BirthDate: "",
    BirthCity: "",
    BirthState: "",
    BirthCountry: "",
    GlobalTeamID: "",
    Height: "",
    Weight: "",
  });
  const [showDeleted, setShowDeleted] = useState(false);

  useEffect(() => {
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

  const fetchPlayers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/players");
      setPlayers(response.data);
    } catch (error) {
      console.error("Erro ao obter dados dos jogadores:", error);
    }
  };

  const handleTeamChange = (event) => {
    const selectedFilterTeam = event.target.value;
    setSelectedFilterTeam(selectedFilterTeam);
  };

  const handleEditPlayer = (player) => {
    setEditingPlayer(player);
    setSelectedEditTeam(player.TeamID);
    setEditFormData({
      ...editFormData,
      Equipas_id_Equipas: player.Equipas_id_Equipas,
      PlayerID: player.PlayerID,
      Status: player.Status,
      TeamID: player.TeamID,
      Team: player.Team,
      Jersey: player.Jersey,
      PositionCategory: player.PositionCategory,
      Position: player.Position,
      FirstName: player.FirstName,
      LastName: player.LastName,
      BirthDate: formatDateForInput(player.BirthDate),
      BirthCity: player.BirthCity,
      BirthState: player.BirthState,
      BirthCountry: player.BirthCountry,
      GlobalTeamID: player.GlobalTeamID,
      Height: player.Height,
      Weight: player.Weight,
    });
  };

  const handleEditFormChange = (event) => {
    const { name, value } = event.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });

    if (name === "Equipas_id_Equipas") {
      setSelectedEditTeam(value);
      const selectedTeamData = teams.find(
        (team) => team.id_Equipas === parseInt(value)
      );
      if (selectedTeamData) {
        setEditFormData((prevFormData) => ({
          ...prevFormData,
          TeamID: selectedTeamData.TeamID,
          Team: selectedTeamData.TeamKey,
        }));
      }
    }
  };

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month < 10) month = `0${month}`;
    if (day < 10) day = `0${day}`;
    return `${year}-${month}-${day}`;
  };

  const isOver18Years = (date) => {
    const today = new Date();
    const birthDate = new Date(date);
    const ageDifference = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    return ageDifference > 18 || (ageDifference === 18 && monthDifference >= 0);
  };

  const handleEditFormSubmit = async (event) => {
    event.preventDefault();
    if (
      !editFormData.Equipas_id_Equipas ||
      editFormData.Equipas_id_Equipas === null
    ) {
      console.error("Equipas_id_Equipas não pode ser nulo.");
      return;
    }
    if (!isOver18Years(editFormData.BirthDate)) {
      console.error("O jogador deve ter mais de 18 anos.");
      return;
    }
    try {
      await axios.put(
        `http://localhost:8000/api/players/update/${editingPlayer.PlayerID}`,
        {
          ...editFormData,
        }
      );
      console.log("Jogador atualizado com sucesso:", editFormData);
      setFilteredPlayers(
        filteredPlayers.map((player) =>
          player.PlayerID === editingPlayer.PlayerID
            ? { ...player, ...editFormData }
            : player
        )
      );
      setEditingPlayer(null);
    } catch (error) {
      console.error("Erro ao atualizar jogador:", error);
    }
  };

  const handleDeletePlayer = async (playerId) => {
    try {
      await axios.put(
        `http://localhost:8000/api/players/delete/${playerId}`,
        {
          PlayerID: playerId,
          Status: "Deleted",
        }
      );
      console.log("Jogador marcado como 'Deleted' com sucesso:", playerId);
      fetchPlayers();
    } catch (error) {
      console.error("Erro ao marcar jogador como 'Deleted':", error);
    }
  };

  const handleReactivatePlayer = async (playerId) => {
    try {
      await axios.put(
        `http://localhost:8000/api/players/reactivate/${playerId}`,
        { PlayerID: playerId, Status: "Active" }
      );
      console.log("Jogador reativado com sucesso:", playerId);
      // Atualizar apenas o jogador reativado no estado players
      setPlayers(players.filter((player) => player.PlayerID !== playerId));
    } catch (error) {
      console.error("Erro ao reativar jogador:", error);
    }
  };

  const handleToggleDeletedPlayers = () => {
    setShowDeleted(!showDeleted);
  };

  useEffect(() => {
    const filteredByStatus = filterPlayersByStatus(players);
    const filteredByTeam = filterPlayersByTeam(filteredByStatus);
    setFilteredPlayers(filteredByTeam);
  }, [players, showDeleted, selectedFilterTeam]);

  const filterPlayersByStatus = (players) => {
    return showDeleted ? players.filter(player => player.Status === "Deleted") : players.filter(player => player.Status === "Active");
  };

  const filterPlayersByTeam = (players) => {
    return selectedFilterTeam
      ? players.filter(
          (player) => player.Team.toLowerCase() === selectedFilterTeam.toLowerCase()
        )
      : players;
  };

  return (
    <div>
      <h1>NBA Players List</h1>
      {user && user.rolesid === 1 && (
        <button onClick={handleToggleDeletedPlayers}>
          {showDeleted
            ? "Esconder Jogadores Deletados"
            : "Mostrar Jogadores Deletados"}
        </button>
      )}
      <label htmlFor="filterTeamSelect">Filtrar por Equipe: </label>
      <select
        id="teamSelect"
        value={selectedFilterTeam}
        onChange={handleTeamChange}
      >
        <option value="">Todas as Equipes</option>
        {teams.map((team) => (
          <option key={team.TeamID} value={team.TeamKey}>
            {`${team.TeamName}`}
          </option>
        ))}
      </select>

      <ul id="playersList">
        {filteredPlayers.map((player) => (
          <li key={player.PlayerID} className="player">
            <strong>{`${player.FirstName} ${player.LastName}`}</strong> -{" "}
            {`${player.Position}, Team: ${player.TeamName}`}
            {user && user.rolesid === 1 && (
              <div>
                <button onClick={() => handleEditPlayer(player)}>
                  Editar
                </button>
                <button
                  onClick={() =>
                    player.Status === "Deleted"
                      ? handleReactivatePlayer(player.PlayerID)
                      : handleDeletePlayer(player.PlayerID)
                  }
                >
                  {player.Status === "Deleted" ? "Reativar" : "Excluir"}
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div
        id="playerCount"
        style={{ textAlign: "center", marginTop: "20px" }}
      >
        Total de jogadores: {filteredPlayers.length}
      </div>

      {editingPlayer && (
        <form onSubmit={handleEditFormSubmit}>
          <h2>Editar Jogador</h2>
          <label htmlFor="firstName">Primeiro Nome:</label>
          <input
            type="text"
            id="firstName"
            name="FirstName"
            value={editFormData.FirstName}
            onChange={handleEditFormChange}
          />
          <label htmlFor="lastName">Último Nome:</label>
          <input
            type="text"
            id="lastName"
            name="LastName"
            value={editFormData.LastName}
            onChange={handleEditFormChange}
          />
          <label htmlFor="team">Equipe:</label>
          <select
            id="team"
            name="Equipas_id_Equipas"
            value={selectedEditTeam}
            onChange={handleEditFormChange}
          >
            {teams.map((team) => (
              <option key={team.id_Equipas} value={team.id_Equipas}>
                {`${team.City} ${team.TeamName}`}
              </option>
            ))}
          </select>

          <label htmlFor="birthDate">Data de Nascimento:</label>
          <input
            type="date"
            id="birthDate"
            name="BirthDate"
            value={editFormData.BirthDate}
            onChange={handleEditFormChange}
          />
          <label htmlFor="birthCity">Cidade de Nascimento:</label>
          <input
            type="text"
            id="birthCity"
            name="BirthCity"
            value={editFormData.BirthCity}
            onChange={handleEditFormChange}
          />
          <label htmlFor="birthState">Estado de Nascimento:</label>
          <input
            type="text"
            id="birthState"
            name="BirthState"
            value={editFormData.BirthState}
            onChange={handleEditFormChange}
          />
          <label htmlFor="birthCountry">País de Nascimento:</label>
          <input
            type="text"
            id="birthCountry"
            name="BirthCountry"
            value={editFormData.BirthCountry}
            onChange={handleEditFormChange}
          />
          <label htmlFor="height">Altura:</label>
          <input
            type="text"
            id="height"
            name="Height"
            value={editFormData.Height}
            onChange={handleEditFormChange}
          />
          <label htmlFor="weight">Peso:</label>
          <input
            type="text"
            id="weight"
            name="Weight"
            value={editFormData.Weight}
            onChange={handleEditFormChange}
          />
          <button type="submit">Salvar Alterações</button>
        </form>
      )}
    </div>
  );
};

export default PlayersPage;
