import React from 'react';
import App from '../components/Dashboard_Client/main';
import Dashboard from '../components/Dashboard_User/main';

const role = localStorage.getItem("role");

const Dashboard1 = () => {
  return role === 'Client' ? <App /> : <Dashboard />;
};

export default Dashboard1;
