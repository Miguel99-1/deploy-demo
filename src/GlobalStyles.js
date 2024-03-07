// GlobalStyles.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
/* Global styles */
body {
    font-family: Arial, sans-serif;
    background-color: #f5f5f5;
    margin: 0;
    padding: 0;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  /* Header styles */
  header {
    background-color: #333;
    color: #fff;
    padding: 20px 0;
    text-align: center;
  }
  
  header h1 {
    margin: 0;
    font-size: 36px;
  }
  
  /* Navigation styles */
  nav {
    background-color: #444;
    padding: 10px 0;
    text-align: center;
  }
  
  nav ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  nav ul li {
    display: inline;
    margin: 0 10px;
  }
  
  nav ul li a {
    color: #fff;
    text-decoration: none;
    font-size: 18px;
  }
  
  nav ul li a:hover {
    color: #ffcc00;
  }
  
  /* Form styles */
  form {
    margin-bottom: 20px;
  }
  
  form label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  form input[type="text"],
  form input[type="email"],
  form input[type="password"],
  form select {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  form button {
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 5px;
  }
  
  form button:hover {
    background-color: #0056b3;
  }
  
  /* Table styles */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  
  table th,
  table td {
    padding: 10px;
    border: 1px solid #ccc;
    text-align: center;
  }
  
  table th {
    background-color: #333;
    color: #fff;
  }
  
  /* Button styles */
  button {
    background-color: #28a745;
    color: #fff;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 5px;
  }
  
  button:hover {
    background-color: #218838;
  }
  
  /* Footer styles */
  footer {
    background-color: #333;
    color: #fff;
    text-align: center;
    padding: 20px 0;
  }
  
`;

export default GlobalStyles;