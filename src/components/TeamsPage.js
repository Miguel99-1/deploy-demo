import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        // Busca o logo das equipes da API
        const apiResponse = await axios.get('https://api.sportsdata.io/v3/nba/scores/json/teams?key=ada39cffc94442059f91f8c50e7d0dff');
        const apiTeams = apiResponse.data.map(team => ({
          TeamID: team.TeamID,
          WikipediaLogoUrl: team.WikipediaLogoUrl,
        }));

        // Busca as outras informações das equipes do banco de dados
        const dbResponse = await axios.get('http://localhost:8000/api/equipas');
        const dbTeams = dbResponse.data.map(team => ({
          TeamID: team.TeamID,
          TeamName: team.TeamName,
          City: team.City,
        }));

        // Combina os dados do logo da API com as informações do banco de dados
        const combinedTeams = dbTeams.map(dbTeam => ({
          ...dbTeam,
          ...apiTeams.find(apiTeam => apiTeam.TeamID === dbTeam.TeamID)
        }));

        setTeams(combinedTeams);
      } catch (error) {
        console.error('Erro ao obter dados das equipas:', error);
      }
    };

    fetchTeams();
  }, []);


  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredTeams = teams.filter(team =>
    team.TeamName.toLowerCase().includes(searchTerm) ||
    team.City.toLowerCase().includes(searchTerm)
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
             <Link to={`/team/${team.TeamID}`}>

              {team.WikipediaLogoUrl && ( // Verifica se team.WikipediaLogoUrl está definido
                <img src={team.WikipediaLogoUrl} alt={`${team.TeamName} Logo`} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
              )}
            </Link>
            <strong>{team.TeamName}</strong> - {team.City}
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