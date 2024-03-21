import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SeasonGames = () => {
  const [selectedSeason, setSelectedSeason] = useState('2024');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [teams, setTeams] = useState([]);
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetchGames(selectedSeason);
    fetchTeams();
  }, []);

  const fetchTeams = () => {
    fetch('https://api.sportsdata.io/v3/nba/scores/json/teams?key=ada39cffc94442059f91f8c50e7d0dff')
      .then(response => response.json())
      .then(data => {
        setTeams(data);
      })
      .catch(error => {
        console.error('Erro ao obter dados da API:', error);
      });
  };

  const handleAddGame = async (game) =>{
    try {
        // Envia dados para o servidor Node.js
        await axios.post("http://localhost:8000/addgame", game);
        console.log("Dados do jogo enviados com sucesso para o servidor");
      } catch (error) {
        console.error("Erro ao enviar dados do jogo para o servidor:", error);
      }
  }
  const fetchGames = () => {
    // Limpa os jogos antes de fazer uma nova busca
    setGames([]);

    // Verifica se a temporada foi selecionada
    if (!selectedSeason) {
      console.error('Por favor, selecione a temporada.');
      return;
    }

    // Obtém o ID da equipa selecionada
    const selectedTeamId = selectedTeam ? teams.find(team => team.Name === selectedTeam)?.TeamID : null;

    // Constrói a URL para obter os jogos da temporada
    const seasonGamesUrl = `https://api.sportsdata.io/v3/nba/scores/json/SchedulesBasic/${selectedSeason}?key=ada39cffc94442059f91f8c50e7d0dff`;

    // Faz a busca dos jogos com a temporada selecionada
    fetch(seasonGamesUrl)
      .then(response => response.json())
      .then(data => {
        // Filtra os jogos pela equipa selecionada, se houver uma
        const teamGames = selectedTeamId
          ? data.filter(game => game.AwayTeamID === selectedTeamId || game.HomeTeamID === selectedTeamId)
          : data;

        setGames(teamGames);
      })
      .catch(error => console.error('Erro ao obter dados da API:', error));
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
        {teams.map(team => (
          <option key={team.TeamID} value={team.Name}>
            {team.Name}
          </option>
        ))}
      </select>
      <button onClick={() => fetchGames(selectedSeason || '2024')}>Procurar Jogos</button>

      <table>
        <thead>
          <tr>
            <th>Data e Hora</th>
            <th>Equipa da Casa</th>
            <th>Equipa Visitante</th>
            <th>Resultado</th>
            <th>Estado</th>
            <th>Acao</th>
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
              <button onClick={() => handleAddGame(game)}>Adicionar</button>
            </tr>

          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SeasonGames;
