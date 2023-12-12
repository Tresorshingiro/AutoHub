import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Portals from './assets/components/Portals';
import SignIn from './assets/components/SignIn';
import Reception from './assets/components/Reception';

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Portals />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/reception" element={<Reception />} />
      </Routes>
    </Router>
  );
};

export default App;
