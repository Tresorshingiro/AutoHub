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
import Cleared from './assets/components/cleared';
import AddSupplier from './assets/pages/AddSupplier';
import AddStock from './assets/pages/AddStock';
import AddPurchase from './assets/pages/AddPurchase';
import SupplierList from './assets/pages/SupplierList';
import StockList from './assets/pages/StockList';
import PurchaseList from './assets/pages/PurchaseList';
import Invoice from './assets/pages/invoice';
import AddInvoices from './assets/pages/AddInvoice';
import AddItem from './assets/pages/AddItem';
import Approved from './assets/pages/Approved';
import PrintModal from './assets/components/PrintModal';

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
      <Route path="/view/:id" element={<View/>}/>
      <Route path="/update/:id"element={<Update/>}/>
      <Route path="/quotation/:id"element={<Quotation/>}/>
      <Route path="/quotationlist"element={<QuotationList/>}/>
      <Route path="/cleared"element={<Cleared/>}/>
      <Route path="/AddSupplier"element={<AddSupplier/>}/>
      <Route path="/AddStock"element={<AddStock/>}/>
      <Route path="/AddPurchase"element={<AddPurchase/>}/>
      <Route path="/suppliers"element={<SupplierList/>}/>
      <Route path="/stock"element={<StockList/>}/>
      <Route path="/purchase"element={<PurchaseList/>}/>
      <Route path="/Invoice"element={<Invoice/>}/>
      <Route path="/AddInvoice"element={<AddInvoices/>}/>
      <Route path="/AddItem"element={<AddItem/>}/>
      <Route path="/Approved/:id"element={<Approved/>}/>
      <Route path="/printmodel"element={<PrintModal/>}/>
      </Routes>
    </Router>
  );
};

export default App;
