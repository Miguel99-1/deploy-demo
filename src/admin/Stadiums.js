// src/components/Stadiums.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const Stadiums = () => {
  const [stadiums, setStadiums] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchStadiums();
  }, []);

  const fetchStadiums = () => {
    fetch(
      "https://api.sportsdata.io/v3/nba/scores/json/Stadiums?key=ada39cffc94442059f91f8c50e7d0dff"
    )
      .then((response) => response.json())
      .then((data) => {
        setStadiums(data);
      })
      .catch((error) => {
        console.error("Erro ao obter dados da API de estádios:", error);
      });
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredStadiums = stadiums.filter(
    (stadium) =>
      stadium.Name.toLowerCase().includes(searchTerm) ||
      stadium.City.toLowerCase().includes(searchTerm) ||
      stadium.State.toLowerCase().includes(searchTerm)
  );

  const handleAddStadium = async (stadium) => {
    try {
      // Envia dados para o servidor Node.js
      await axios.post("http://localhost:8000/adddata-stadium", stadium);
      console.log("Dados do estádio enviados com sucesso para o servidor");
    } catch (error) {
      console.error("Erro ao enviar dados do estádio para o servidor:", error);
    }
  };

  return (
    <div>
      <h1>NBA Stadiums List</h1>

      <input
        type="text"
        id="searchInput"
        placeholder="Pesquisar por estádio..."
        value={searchTerm}
        onChange={handleSearchInputChange}
      />

      <ul>
        {filteredStadiums.map((stadium) => (
          <li key={stadium.StadiumID} className="stadium">
            <strong>{stadium.Name}</strong> - {stadium.City}, {stadium.State}
            <button onClick={() => handleAddStadium(stadium)}>Adicionar</button>
          </li>
        ))}
      </ul>

      <div id="stadiumCount" style={{ textAlign: "center", marginTop: "20px" }}>
        Total de estádios: {filteredStadiums.length}
      </div>
    </div>
  );
};

export default Stadiums;
