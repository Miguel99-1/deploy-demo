import React, { useState } from 'react';
import axios from 'axios';

const DayGames = () => {
  const [selectedDay, setSelectedDay] = useState('');
  const [games, setGames] = useState([]);


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

    // Faz a busca dos jogos para o dia selecionado
    fetch(`https://api.sportsdata.io/v3/nba/scores/json/ScoresBasic/${selectedDay}?key=ada39cffc94442059f91f8c50e7d0dff`)
      .then(response => response.json())
      .then(data => {
        // Verifica se a resposta possui uma propriedade 'games'
        const gamesData = Array.isArray(data) ? data : data.games || [];
        setGames(gamesData);
      })
      .catch(error => console.error('Erro ao obter dados da API:', error));
  };

  return (
    <div>
      <h1>NBA Games List</h1>

      <label htmlFor="dayInput">Dia:</label>
      <input
        type="text"
        id="dayInput"
        placeholder="Ex: 2023-10-24"
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

export default DayGames;
