import React, { useState, useEffect } from "react";
import axios from "axios";

const DataDisplay = () => {
  const [data, setData] = useState([]);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [playerCount, setPlayerCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get(
          "https://api.sportsdata.io/v3/nba/scores/json/Players?key=ada39cffc94442059f91f8c50e7d0dff"
        );

        const formattedPlayers = response.data.map((player) => ({
          PlayerID: player.PlayerID,
          Status: player.Status,
          TeamID: player.TeamID,
          Team: player.Team,
          Jersey: player.Jersey,
          PositionCategory: player.PositionCategory,
          Position: player.Position,
          FirstName: player.FirstName,
          LastName: player.LastName,
          BirthDate: player.BirthDate,
          BirthCity: player.BirthCity,
          BirthState: player.BirthState,
          BirthCountry: player.BirthCountry,
          GlobalTeamID: player.GlobalTeamID,
          Height: player.Height,
          Weight: player.Weight,
        }));

        setData(formattedPlayers);
        setPlayers(formattedPlayers);
        setPlayerCount(formattedPlayers.length);
      } catch (error) {
        console.error("Erro ao obter dados da API:", error);
      }
    };

    const fetchTeams = async () => {
      try {
        const response = await axios.get(
          "https://api.sportsdata.io/v3/nba/scores/json/teams?key=ada39cffc94442059f91f8c50e7d0dff"
        );

        setTeams(response.data);
      } catch (error) {
        console.error("Erro ao obter dados das equipas:", error);
      }
    };

    fetchPlayers();
    fetchTeams();
  }, []);

  const handleTeamChange = (event) => {
    const selectedTeam = event.target.value;

    setSelectedTeam(selectedTeam);

    const filteredPlayers = data.filter((player) =>
      selectedTeam
        ? player.Team.toLowerCase() === selectedTeam.toLowerCase()
        : true
    );

    setPlayerCount(filteredPlayers.length);
    setPlayers(filteredPlayers);
  };

  const handleAddData = async (item) => {
    try {
      await axios.post("http://localhost:8000/adddata", item);
      console.log("Dados enviados com sucesso para o servidor");
    } catch (error) {
      console.error("Erro ao enviar dados para o servidor:", error);
    }
  };

  const handleAddAllPlayers = async () => {
    try {
      const filteredPlayersData = data.filter(
        (player) => player.Team.toLowerCase() === selectedTeam.toLowerCase()
      );
      await axios.post(
        "http://localhost:8000/adddata-all-players",
        filteredPlayersData
      );
      console.log(
        "Jogadores da equipe selecionada adicionados com sucesso ao servidor"
      );
    } catch (error) {
      console.error(
        "Erro ao adicionar jogadores da equipe selecionada:",
        error
      );
    }
  };

  const handleEdit = (player) => {
    console.log("Editando jogador:", player);
    setEditingPlayer({ ...player });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/updateData/${editingPlayer.PlayerID}`, editingPlayer);
      console.log("Dados atualizados com sucesso no servidor");
      // Atualize o estado localmente, se necessário
      setEditingPlayer(null); // Limpe o estado de edição
    } catch (error) {
      console.error("Erro ao atualizar dados no servidor:", error);
    }
  };

  const handleInputChange = (e, field) => {
    // Atualiza o estado do jogador editado localmente
    const value = e.target.value;
    setEditingPlayer((prevEditingPlayer) => ({
      ...prevEditingPlayer,
      [field]: value,
    }));
  };


  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredPlayers = players.filter((player) =>
    selectedTeam
      ? player.Team.toLowerCase() === selectedTeam.toLowerCase()
      : true ||
      player.Name.toLowerCase().includes(searchTerm)
  );

  return (
    <div>
      <h2>Dados</h2>
      <input
        type="text" 
        id="searchInput"
        placeholder="Pesquisar por jogador..."
        value={searchTerm}
        onChange={handleSearchInputChange}
      />

      <label htmlFor="teamSelect">Selecionar Equipe: </label>
      <select id="teamSelect" value={selectedTeam} onChange={handleTeamChange}>
        <option value="">Todas as Equipes</option>
        {teams.map((team) => (
          <option key={team.TeamID} value={team.Key}>
            {team.Name}
          </option>
        ))}
      </select>

      {selectedTeam && ( // Renderiza apenas se uma equipe estiver selecionada
        <button onClick={handleAddAllPlayers}>
          Adicionar Todos os Jogadores
        </button>
      )}

      <p>{`Jogadores sendo exibidos: ${filteredPlayers.length}`}</p>
      <ul id="playersList">
        {filteredPlayers.map((player) => (
          <li key={player.PlayerID} className="player">
            <strong>{`${player.FirstName} ${player.LastName}`}</strong> -{" "}
            {`${player.Position}, Team: ${player.Team}`}
            <button
              onClick={() => {
                console.log(player.TeamID);
                handleAddData({ ...player, TeamID: player.TeamID });
              }}
            >
              Adicionar
            </button>
            <button onClick={() => handleEdit(player)}>Editar</button>
          </li>
        ))}
      </ul>
      {editingPlayer && (
        <div>
          <h3>Editar Dados</h3>
          <form>
            <label>
              FirstName:
              <input
                type="text"
                value={editingPlayer.FirstName}
                onChange={(e) => handleInputChange(e, "FirstName")}
              />
            </label>
            <label>
              LastName:
              <input
                type="text"
                value={editingPlayer.LastName}
                onChange={(e) => handleInputChange(e, "LastName")}
              />
            </label>
            <label>
              Position:
              <input
                type="text"
                value={editingPlayer.Position}
                onChange={(e) => handleInputChange(e, "Position")}
              />
            </label>
            <button type="button" onClick={handleUpdate}>
              Atualizar
            </button>
          </form>
          <pre>{JSON.stringify(editingPlayer, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default DataDisplay;
