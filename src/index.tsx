import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { SonglistProvider } from './context/SongListContext';
import { TransposeProvider } from './context/TransposeContext';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <SonglistProvider>
    <TransposeProvider>
       <App />
       </TransposeProvider>
       </SonglistProvider>
    </BrowserRouter>
  </React.StrictMode>
);


