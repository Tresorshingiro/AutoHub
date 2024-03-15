import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // Assuming your main component is in App.js or App.jsx
import { AuthContextProvider } from './assets/context/AuthContext';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <AuthContextProvider>
        <App />
    </AuthContextProvider>
);
