import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TeamDetailsPage = ({ match }) => {
    const [team, setTeam] = useState(null);
  
    useEffect(() => {
      const fetchTeamDetails = async () => {
        if (!match || !match.params || !match.params.TeamId) return;
  
        try {
          const response = await axios.get(`http://localhost:8000/api/teams/${match.params.TeamId}`);
          if (response.data) {
            setTeam(response.data);
          } else {
            console.error('Dados da equipe não encontrados');
          }
        } catch (error) {
          console.error('Erro ao obter detalhes da equipe:', error);
        }
      };
  
      fetchTeamDetails();
    }, [match]);
  
    if (!team) {
      return <div>Carregando...</div>;
    }
  
    return (
      <div>
        <h1>Detalhes da Equipe</h1>
        {team.TeamName && (
          <>
            <h2>{team.TeamName}</h2>
            <p>Conferência: {team.Conference}</p>
            <p>Divisão: {team.Division}</p>
            {/* Adicione mais informações da equipe aqui, se necessário */}
          </>
        )}
      </div>
    );
  };
  

export default TeamDetailsPage;