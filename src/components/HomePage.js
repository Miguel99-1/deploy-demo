// src/components/HomePage.js
import React from 'react';
import axios from 'axios';

const HomePage = () => {
  return (
    <div>
      <button onClick={
        async () => {
          console.log('Home')
          const response = await axios.post('http://localhost:8000/teste');
          console.log(response);

        }
      }>Enviar email</button>
      <h1>Bem-vindo à Página Inicial</h1>
      <p>Esta é a página inicial do seu aplicativo.</p>
    </div>
  );
}

export default HomePage;
