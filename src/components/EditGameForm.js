import React, { useState, useEffect } from 'react';

const EditGameForm = ({ gameId, onSaveEdit, selectedDay }) => {
  const [editedData, setEditedData] = useState({
    DateTime: '',
    HomeTeam: '',
    AwayTeam: '',
    HomeTeamScore: '',
    AwayTeamScore: '',
    Status: '',
  });

  const fetchDataForEdit = async (gameId) => {
    try {
      if (!selectedDay || selectedDay.trim() === '') {
        console.error('selectedDay não está definido ou está vazio. Não é possível buscar dados para edição.');
        return;
      }
  
      const response = await fetch(`https://api.sportsdata.io/v3/nba/scores/json/GamesByDate/${selectedDay}?key=ada39cffc94442059f91f8c50e7d0dff`);
      const data = await response.json();
  
      if (response.ok) {
        const gameToEdit = data.find((game) => game.GameID === gameId);
        setEditedData(gameToEdit || {});
      } else {
        alert('Erro ao obter detalhes do jogo para edição.');
      }
    } catch (error) {
      console.error('Erro ao obter detalhes do jogo para edição:', error);
    }
  };
  

  useEffect(() => {
    if (gameId) {
      fetchDataForEdit(gameId);
    }
  }, [gameId, selectedDay]);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = () => {
    onSaveEdit(gameId, editedData);
  };

  return (
    <div>
      <h2>Editar Jogo</h2>
      <form>
        <label>Data e Hora:</label>
        <input
          type="text"
          name="DateTime"
          value={editedData.DateTime}
          onChange={handleInputChange}
        />
        <button type="button" onClick={handleSave}>
          Salvar Edições
        </button>
      </form>
    </div>
  );
};

export default EditGameForm;
