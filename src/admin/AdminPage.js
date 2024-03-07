// AdminPage.js
import React from 'react';
import DataDisplay from './DataDisplay';
import Teams from './Teams';
import Stadiums from './Stadiums';

const AdminPage = () => {
  return (
    <div>
      <h1>Admin Page</h1>
      <Stadiums />
      <Teams /> 
      <DataDisplay />
    </div>
  );
};

export default AdminPage;