import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Portals from './assets/components/Portals';
import SignIn from './assets/components/SignIn';
import Reception from './assets/components/Reception';
import Accountant from './assets/components/Accountant';
import Admin from './assets/components/Admin';
import Management from './assets/components/Management';
import Operations from './assets/components/Operations';
import Owner from './assets/components/Owner';

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Portals />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/reception" element={<Reception />} />
      <Route path="/accountant" element={<Accountant />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/management" element={<Management />} />
      <Route path="/operations" element={<Operations />} />
      <Route path="/owner" element={<Owner />} />
      </Routes>
    </Router>
  );
};

export default App;
