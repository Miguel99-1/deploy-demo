import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const TeamDetailsPage = () => {
  const [team, setTeam] = useState(null);
  const [stadium, setStadium] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/equipas/${id}`);
        if (response.data) {
          setTeam(response.data);

          // Busca detalhes do estádio usando o Estadios_id_Estadios
          const stadiumId = response.data.Estadios_id_Estadios;
          const stadiumResponse = await axios.get(`http://localhost:8000/api/estadios/${stadiumId}`);
          if (stadiumResponse.data) {
            setStadium(stadiumResponse.data);
          } else {
            console.error('Detalhes do estádio não encontrados');
          }
        } else {
          console.error('Dados da equipe não encontrados');
        }
      } catch (error) {
        console.error('Erro ao obter detalhes da equipe:', error);
      }
    };

    fetchTeamDetails();
  }, [id]);

  return (
    <div>
      <h1>Detalhes da Equipe</h1>
      {team && stadium ? (
        <>
          <h2>{team.TeamName}</h2>
          <p>Conferência: {team.Conference}</p>
          <p>Divisão: {team.Division}</p>
          <p>Cidade: {team.City}</p>
          <p>Estádio: {stadium.Name}</p>
          <p>Endereço: {stadium.Address}</p>
          <p>Capacidade: {stadium.Capacity}</p>
          <p>Cor Principal: #{team.PrimaryColor}</p>
          <p>Cor Secundária: #{team.SecondaryColor}</p>
          <p>Cor Terciária: #{team.TertiaryColor}</p>
          <p>Treinador: {team.HeadCoach}</p>
          {/* Adicione mais informações da equipe aqui, se necessário */}
          {team.WikipediaLogoUrl && (
            <img
              src={team.WikipediaLogoUrl}
              alt={`${team.TeamName} Logo`}
              style={{ width: '100px', height: '100px' }}
            />
          )}
        </>
      ) : (
        <div>Carregando...</div>
      )}
    </div>
  );
};

export default TeamDetailsPage;
