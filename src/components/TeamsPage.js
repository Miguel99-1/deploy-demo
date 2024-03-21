import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const TeamsPage = ({ user }) => {
  const [teams, setTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        // Busca as informações das equipes do banco de dados
        const dbResponse = await axios.get("http://localhost:8000/api/equipas");
        const dbTeams = dbResponse.data.map((team) => ({
          TeamID: team.TeamID,
          TeamName: team.TeamName,
          City: team.City,
          WikipediaLogoUrl: team.WikipediaLogoUrl
        }));
        
        setTeams(dbTeams);
      } catch (error) {
        console.error("Erro ao obter dados das equipas:", error);
      }
    };

    fetchTeams();
  }, []);

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredTeams = teams.filter(
    (team) =>
      team.TeamName.toLowerCase().includes(searchTerm) ||
      team.City.toLowerCase().includes(searchTerm)
  );

  const handleDeleteTeam = async (teamID) => {
    if (user && user.rolesid === 1) {
      try {
        // Implemente sua lógica de exclusão de equipe aqui
        await axios.delete(`http://localhost:8000/api/equipas/delete/${teamID}`);
        // Após a exclusão bem-sucedida, atualize a lista de equipes
        const updatedTeams = teams.filter((team) => team.TeamID !== teamID);
        setTeams(updatedTeams);
      } catch (error) {
        console.error("Erro ao excluir equipe:", error);
      }
    } else {
      alert("Você não tem permissão para excluir equipes.");
    }
  };

  return (
    <div>
      <h1>NBA Teams List</h1>

      <input
        type="text"
        id="searchInput"
        placeholder="Pesquisar por equipe..."
        value={searchTerm}
        onChange={handleSearchInputChange}
      />

      <ul>
        {filteredTeams.map((team) => (
          <li key={team.TeamID} className="team">
            <Link to={`/team/${team.TeamID}`}>
              {team.WikipediaLogoUrl && (
                <img
                  src={team.WikipediaLogoUrl}
                  alt={`${team.TeamName} Logo`}
                  style={{ width: "50px", height: "50px", marginRight: "10px" }}
                />
              )}
            </Link>
            <strong>{team.TeamName}</strong> - {team.City}
            {/* Mostrar o botão de exclusão apenas se o usuário tiver permissão */}
            {user && user.rolesid === 1 && (
              <button onClick={() => handleDeleteTeam(team.TeamID)}>Excluir</button>
            )}
          </li>
        ))}
      </ul>

      <div id="teamCount" style={{ textAlign: "center", marginTop: "20px" }}>
        Total de equipes: {filteredTeams.length}
      </div>
    </div>
  );
};

export default TeamsPage;
