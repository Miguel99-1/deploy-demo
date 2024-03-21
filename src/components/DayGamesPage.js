import React, { useState, useEffect } from "react";

const SeasonGamesPage = () => {
  const [selectedDay, setSelectedDay] = useState("");
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = () => {
    // Limpa os jogos antes de fazer uma nova busca
    setGames([]);

    // Verifica se o dia foi selecionado
    if (!selectedDay) {
      console.error("Por favor, selecione o dia.");
      return;
    }

    // Constrói a URL para obter os jogos do dia selecionado
    const dayGamesUrl = `http://localhost:8000/api/game/${selectedDay}`;

    // Faz a busca dos jogos do dia selecionado
    fetch(dayGamesUrl)
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

      <label htmlFor="dayInput">Dia:</label>
      <input
        type="text"
        id="dayInput"
        placeholder="Ex: 2024-03-20"
        value={selectedDay}
        onChange={(e) => setSelectedDay(e.target.value)}
      />

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
