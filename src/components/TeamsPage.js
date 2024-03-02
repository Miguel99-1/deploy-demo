// src/components/TeamsPage.js
import React, { useState, useEffect } from 'react';

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
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

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredTeams = teams.filter(team =>
    team.Name.toLowerCase().includes(searchTerm) ||
    team.Conference.toLowerCase().includes(searchTerm) ||
    team.Division.toLowerCase().includes(searchTerm)
  );

  return (
    <div>
      <h1>NBA Teams List</h1>

      <input
        type="text"
        id="searchInput"
        placeholder="Pesquisar por equipa..."
        value={searchTerm}
        onChange={handleSearchInputChange}
      />
    
      <ul>
        {filteredTeams.map(team => (
          <li key={team.TeamID} className="team">
            <strong>{team.Name} {team.Conference}</strong> - {team.Division}
          </li>
        ))}
      </ul>

      <div id="teamCount" style={{ textAlign: 'center', marginTop: '20px' }}>
        Total de equipas: {filteredTeams.length}
      </div>
    </div>
  );
};

export default TeamsPage;
