import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* Reset styles */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: Arial, sans-serif;
    background-color: #e8eaf6; /* Fundo do corpo - cinza mais claro */
    color: #333; /* Cor do texto principal - cinza escuro */
    line-height: 1.6;
  }

  a {
    text-decoration: none;
    color: #2196f3; /* Azul */
  }

  /* Container */
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  /* Header */
  header {
    background-color: #1976d2; /* Azul */
    color: #fff; /* Branco */
    padding: 20px 0;
    text-align: center;
  }

  header h1 {
    font-size: 36px;
    margin-bottom: 10px;
  }

  header p {
    font-size: 18px;
    margin-bottom: 20px;
  }

  /* Navbar */
  nav {
    background-color: #1976d2; /* Azul */
    color: #fff; /* Branco */
    padding: 8px 0; /* Ajuste do padding */
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Sombra */
  }

  nav ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  nav ul li {
    margin-right: 10px;
  }

  nav ul li:last-child {
    margin-right: 0;
  }

  nav ul li a {
    color: #fff;
    font-size: 16px;
    margin-right: 10px;
    padding: 10px 20px; /* Espaçamento interno */
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }

  nav ul li a:hover {
    background-color: #0d47a1; /* Azul mais escuro */
  }

  /* Button */
  button {
    background-color: #fff; /* Branco */
    color: #2196f3; /* Azul */
    border: none;
    padding: 10px 20px; /* Espaçamento interno */
    font-size: 16px;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  button:hover {
    background-color: #1976d2; /* Azul mais escuro */
    color: #fff; /* Branco */
  }

 

  .header {
    padding: 50px;
    border-radius: 50px;
  }

  .btn {
    display: inline-block;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    text-decoration: none;
    transition: background-color 0.3s ease, color 0.3s ease;
  }



  .text-white {
    color: white;
    font-size: 35px
  }

  .text-gray {
    color: #ffffff
  }

`;

export default GlobalStyles;
