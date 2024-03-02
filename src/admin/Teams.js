// src/components/TeamsPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [data, setData] = useState([]);
  const [editingTeam, setEditingTeam] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = () => {
    fetch(
      "https://api.sportsdata.io/v3/nba/scores/json/teams?key=ada39cffc94442059f91f8c50e7d0dff"
    )
      .then((response) => response.json())
      .then((data) => {
        setTeams(data);
      })
      .catch((error) => {
        console.error("Erro ao obter dados da API:", error);
      });
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredTeams = teams.filter(
    (team) =>
      team.Name.toLowerCase().includes(searchTerm) ||
      team.Conference.toLowerCase().includes(searchTerm) ||
      team.Division.toLowerCase().includes(searchTerm)
  );

  const handleAddData = async (item) => {
    try {
      // Envia dados para o servidor Node.js
      await axios.post("http://localhost:8000/adddata2", item);
      console.log("Dados enviados com sucesso para o servidor");
    } catch (error) {
      console.error("Erro ao enviar dados para o servidor:", error);
    }
  };

  const handleEdit = (team) => {
    console.log("Editando Equipa:", team);
    setEditingTeam({ ...team });
  };
  const handleUpdate = async () => {
    try {
      console.log("Atualizando Equipa:", editingTeam);
  
      await axios.put(
        `http://localhost:8000/updateData2/${editingTeam.TeamID}`,
        {
          TeamName: `${editingTeam.City} ${editingTeam.Name}`,
          City: editingTeam.City,
          // Adicione outros campos aqui conforme necessário
        }
      );
  
      setData((prevData) =>
        prevData.map((team) =>
          team.TeamID === editingTeam.TeamID
            ? { ...team, ...editingTeam }
            : team
        )
      );
  
      console.log("Dados atualizados com sucesso");
      setEditingTeam(null);
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
    }
  };

  const handleInputChange = (e, field) => {
    // Atualiza os campos de edição
    setEditingTeam((prevEditingTeam) => ({
      ...prevEditingTeam,
      [field]: e.target.value,
    }));
  };

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
        {filteredTeams.map((team) => (
          <li key={team.TeamID} className="team">
            <strong>
              {team.Name} {team.Conference}
            </strong>{" "}
            - {team.Division}
            <button onClick={() => handleAddData(team)}>Adicionar</button>
            <button onClick={() => handleEdit(team)}>Editar</button>
          </li>
        ))}
      </ul>

      {editingTeam && (
        <div>
          <h3>Editar Dados</h3>
          // Adicione a classe "edit-form" ao formulário
          <form className="edit-form">
            {/* Adicione outros campos do formulário aqui */}
            <label>
              Name:
              <input
                type="text"
                value={editingTeam.Name}
                onChange={(e) => handleInputChange(e, "Name")}
              />
            </label>
            <button type="button" onClick={handleUpdate}>
              Atualizar
            </button>
          </form>
          {/* Adicione um log extra aqui para verificar o estado editingPlayer */}
          <pre>{JSON.stringify(editingTeam, null, 2)}</pre>
        </div>
      )}

      <div id="teamCount" style={{ textAlign: "center", marginTop: "20px" }}>
        Total de equipas: {filteredTeams.length}
      </div>
    </div>
  );
};

export default Teams;
