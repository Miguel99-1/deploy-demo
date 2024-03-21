import React, { useState, useEffect } from "react";

const SeasonGamesPage = () => {
  const [selectedSeason, setSelectedSeason] = useState("2024");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [teams, setTeams] = useState([]);
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetchTeams();
    fetchGames();
  }, []);

  const fetchTeams = () => {
    fetch("http://localhost:8000/api/equipas") // Alterando a URL para buscar as equipas
      .then((response) => response.json())
      .then((data) => {
        setTeams(data);
      })
      .catch((error) => {
        console.error("Erro ao obter dados da API de equipas:", error);
      });
  };

  const fetchGames = () => {
    // Limpa os jogos antes de fazer uma nova busca
    setGames([]);

    // Verifica se a temporada foi selecionada
    if (!selectedSeason) {
      console.error("Por favor, selecione a temporada.");
      return;
    }

    // Verifica se a equipa foi selecionada
    let seasonGamesUrl = `http://localhost:8000/api/games/${selectedSeason}`;

    // Se uma equipa foi selecionada, adiciona o parâmetro à URL
    if (selectedTeam) {
      seasonGamesUrl += `/${selectedTeam}`;
    }

    // Faz a busca dos jogos com a temporada e equipa selecionadas (se houver)
    fetch(seasonGamesUrl)
      .then((response) => response.json())
      .then((data) => {
        setGames(data);
      })
      .catch((error) =>
        console.error("Erro ao obter dados da API de jogos:", error)
      );
  };

  return (
    <div>
      <h1>NBA Games List</h1>

      <label htmlFor="seasonInput">Temporada:</label>
      <input
        type="text"
        id="seasonInput"
        placeholder="Ex: 2022REG"
        value={selectedSeason}
        onChange={(e) => setSelectedSeason(e.target.value)}
      />

      <label htmlFor="teamSelect">Selecionar Equipa:</label>
      <select
        id="teamSelect"
        value={selectedTeam}
        onChange={(e) => setSelectedTeam(e.target.value)}
      >
        <option value="">-- Selecionar Equipa --</option>
        {teams.map((team) => (
          <option key={team.TeamID} value={team.TeamKey}>
            {team.TeamName}
          </option>
        ))}
      </select>

      <button onClick={fetchGames}>Procurar Jogos</button>

      <table>
        <thead>
          <tr>
            <th>Data e Hora</th>
            <th>Equipa da Casa</th>
            <th>Equipa Visitante</th>
            <th>Resultado</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game, index) => (
            <tr key={index}>
              <td>{game.DateTime}</td>
              <td>{game.HomeTeam}</td>
              <td>{game.AwayTeam}</td>
              <td>{`${game.HomeTeamScore} - ${game.AwayTeamScore}`}</td>
              <td>{game.Status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SeasonGamesPage;
