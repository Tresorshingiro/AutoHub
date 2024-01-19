import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Portals from './assets/pages/Portals';
import SignIn from './assets/pages/SignIn';
import Reception from './assets/pages/Reception';
import Accountant from './assets/pages/Accountant';
import Admin from './assets/pages/Admin';
import Management from './assets/pages/Management';
import Operations from './assets/pages/Operations';
import Owner from './assets/pages/Owner';
import Inservice from './assets/pages/Inservice';
import View from './assets/pages/View';
import Update from './assets/pages/Update';
import Quotation from './assets/pages/Quotation';
import QuotationList from './assets/pages/QuotationList';

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
      <Route path="/inservice" element={<Inservice/>}/>
      <Route path="/view" element={<View/>}/>
      <Route path="/update"element={<Update/>}/>
      <Route path="/quotation"element={<Quotation/>}/>
      <Route path="/quotationlist"element={<QuotationList/>}/>
      </Routes>
    </Router>
  );
};

export default App;
