import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Use createRoot em vez de ReactDOM.render
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderize o componente App dentro do root
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
