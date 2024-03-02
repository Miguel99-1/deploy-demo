// src/services/apiService.js
const apiUrl = 'your_api_endpoint';

export const fetchPlayers = async () => {
  try {
    const response = await fetch(`${apiUrl}/players`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching players:', error);
    throw error;
  }
};
