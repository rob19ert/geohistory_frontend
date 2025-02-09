import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import store from "./store.tsx"
import { Provider } from "react-redux"
import 'bootstrap/dist/css/bootstrap.min.css'; // подключение Bootstrap

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App/>
    </Provider>
  </React.StrictMode>
)

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then(() => console.log("service worker registered"))
      .catch((err) => console.log("service worker not registered", err));
  });
}
