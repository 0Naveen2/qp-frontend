import React from 'react';
import ReactDOM from 'react-dom/client';
import AppWrapper from './App.jsx'; // <-- Change this import
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppWrapper /> {/* <-- And render the wrapper */}
  </React.StrictMode>,
);