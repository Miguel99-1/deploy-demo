// PlayerStatsPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PlayerStatsPage = () => {
  const [playerStats, setPlayerStats] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  const fetchPlayerStats = async () => {
    try {
      const response = await axios.get(`https://api.sportsdata.io/v3/nba/stats/json/PlayerGameStatsByDate/${selectedDate}?key=ada39cffc94442059f91f8c50e7d0dff`);
      setPlayerStats(response.data);
    } catch (error) {
      console.error('Error fetching player statistics:', error);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchPlayerStats();
    }
  }, [selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div>
      <h1>Player Statistics</h1>

      <label htmlFor="dateInput">Select Date:</label>
      <input
        type="date"
        id="dateInput"
        value={selectedDate}
        onChange={handleDateChange}
      />

      <button onClick={fetchPlayerStats}>Fetch Player Stats</button>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Team</th>
            <th>Points</th>
            {/* Add more table headers based on available statistics */}
          </tr>
        </thead>
        <tbody>
          {playerStats.map((player, index) => (
            <tr key={index}>
              <td>{player.Name}</td>
              <td>{player.Team}</td>
              <td>{player.Points}</td>
              {/* Add more table cells based on available statistics */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerStatsPage;
