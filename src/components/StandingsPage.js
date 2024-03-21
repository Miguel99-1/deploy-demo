import React, { useState, useEffect } from 'react';

const StandingsPage = () => {
  const [selectedSeason, setSelectedSeason] = useState('');
  const [standings, setStandings] = useState([]);

  useEffect(() => {
    // Ao carregar o componente, buscamos os dados iniciais (pode ser ajustado conforme necessário)
    fetchStandings('2024');
  }, []);

  const fetchStandings = (season) => {
    fetch(`http://localhost:8000/api/classificacao/${season}`)
      .then(response => response.json())
      .then(data => {
        setStandings(data);
      })
      .catch(error => console.error('Erro ao obter dados da API:', error));
  };

  const handleSeasonChange = (e) => {
    setSelectedSeason(e.target.value);
  };

  const handleFetchStandings = () => {
    fetchStandings(selectedSeason);
  };

  return (
    <div>
      <h1>NBA Standings</h1>

      <label htmlFor="seasonInput">Temporada:</label>
      <input
        type="text"
        id="seasonInput"
        placeholder="Ex: 2024"
        value={selectedSeason}
        onChange={handleSeasonChange}
      />

      <button onClick={handleFetchStandings}>Obter Classificação</button>

      <table>
        <thead>
          <tr>
            <th>Equipa</th>
            <th>Conferência</th>
            <th>Divisão</th>
            <th>Vitórias</th>
            <th>Derrotas</th>
            <th>Percentagem</th>
            <th>Vitórias na Conferência</th>
            <th>Derrotas na Conferência</th>
            {/* Adicione mais colunas conforme necessário */}
          </tr>
        </thead>
        <tbody>
          {standings.map((team, index) => (
            <tr key={index}>
              <td>{team.Name}</td>
              <td>{team.Conference}</td>
              <td>{team.Division}</td>
              <td>{team.Wins}</td>
              <td>{team.Losses}</td>
              <td>{team.Percentage}</td>
              <td>{team.ConferenceWins}</td>
              <td>{team.ConferenceLosses}</td>
              {/* Adicione mais células conforme necessário */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StandingsPage;
