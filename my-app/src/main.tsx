import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import Header from './components/Header.tsx'
import 'bootstrap/dist/css/bootstrap.min.css'; // подключение Bootstrap

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Header/>
    <App />
  </React.StrictMode>
);
