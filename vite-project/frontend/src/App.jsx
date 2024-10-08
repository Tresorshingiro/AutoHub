import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Portals from './assets/pages/Portals';
import SignIn from './assets/pages/SignIn';
import SignUp from './assets/components/SignupForm';
import Reception from './assets/pages/Reception';
import Accountant from './assets/pages/Accountant';
import Admin from './assets/pages/Admin';
import Management from './assets/pages/Management';
import Operations from './assets/pages/Operations';
import Owner from './assets/pages/Owner';
import Inservice from './assets/pages/Inservice';
import View from './assets/components/View';
import Update from './assets/components/Update';
import Quotation from './assets/pages/Quotation';
import QuotationList from './assets/pages/QuotationList';
import Cleared from './assets/components/cleared';
import AddSupplier from './assets/pages/AddSupplier';
import AddPurchase from './assets/pages/AddPurchase';
import SupplierList from './assets/pages/SupplierList';
import StockList from './assets/pages/StockList';
import PurchaseList from './assets/pages/PurchaseList';
import Invoice from './assets/pages/Invoice';
import AddInvoices from './assets/pages/AddInvoice';
import AddItem from './assets/pages/AddItem';
import Approved from './assets/pages/Approved';
import Income from './assets/pages/Income';
import Expense from './assets/pages/Expense';
import AddIncome from './assets/pages/AddIncome';
import AddExpense from './assets/pages/AddExpense';
import PrintModal from './assets/components/PrintModal';
import ClearedAccountant from './assets/pages/ClearedAccountant';
import { useAuthContext } from './assets/hooks/useAuthContext';
import Employee from './assets/pages/Employee';
import AddEmployee from './assets/pages/AddEmployee';
import PendingList from './assets/pages/PendingList';
import Account from './assets/pages/Account';
import VehicleAdmin from './assets/pages/VehicleAdmin';
import SupplierAdmin from './assets/pages/SupplierAdmin';
import Users from './assets/pages/Users';
import UpdateUser from './assets/pages/updateUser';
import './App.css';

const App = () => {
  const { user } = useAuthContext()
  const user_role = user?.role

  return (
    <Router>
      <Routes>
      <Route
        path="/"
        element = { 
        // <Portals />
          user ? <Navigate to={`/${user_role}`} /> : <Portals />
        } />
      <Route path="/signin" element={!user ? <SignIn /> : <Navigate to={`/${user_role}`}/>} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/reception" element={user && user_role === "Reception" ? <Reception /> : <Navigate to={"/"} />} />
      <Route path="/accountant" element={user && user_role === "Accountant" ? <Accountant /> : <Navigate to={"/"} />} />
      <Route path="/admin" element={user ? <Admin /> : <Navigate to={"/"} />} />
      <Route path="/management" element={user ? <Management /> : <Navigate to={"/"} />} />
      <Route path="/operations" element={user ? <Operations /> : <Navigate to={"/"} />} />
      <Route path="/owner" element={<Owner />} />
      <Route path="/inservice" element={user && user_role === "Reception" ? <Inservice/> : <Navigate to={'/'}/> }/>
      <Route path="/view/:id" element={<View/>}/>
      <Route path="/update/:id"element={<Update/>}/>
      <Route path="/quotation/:id"element={<Quotation/>}/>
      <Route path="/quotationlist"element={<QuotationList/>}/>
      <Route path="/cleared"element={<Cleared/>}/>
      <Route path="/AddSupplier"element={<AddSupplier/>}/>
      <Route path="/AddPurchase"element={<AddPurchase/>}/>
      <Route path="/suppliers"element={<SupplierList/>}/>
      <Route path="/stock"element={<StockList/>}/>
      <Route path="/purchase"element={<PurchaseList/>}/>
      <Route path="/Invoice"element={user && user.role == "Accountant" ? <Invoice/> : <Navigate to={'/'} /> }/>
      <Route path="/AddInvoice"element={<AddInvoices/>}/>
      <Route path="/AddItem"element={<AddItem/>}/>
      <Route path="/Approved/:id"element={<Approved/>}/>
      <Route path="/income"element={<Income/>}/>
      <Route path="/expense"element={<Expense/>}/>
      <Route path="/AddIncome"element={<AddIncome/>}/>
      <Route path="/AddExpense"element={<AddExpense/>}/>
      <Route path="/accountantCleared"element={<ClearedAccountant/>}/>
      <Route path="/printmodel"element={<PrintModal/>}/>
      <Route path="/employee"element={<Employee/>}/>
      <Route path="/addemployee"element={<AddEmployee/>}/>
      <Route path="/pendingList"element={<PendingList/>}/>
      <Route path="/account"element={<Account/>}/>
      <Route path="/vehicleAdmin"element={<VehicleAdmin/>}/>
      <Route path="/supplierAdmin"element={<SupplierAdmin/>}/>
      <Route path="/users"element={<Users/>}/>
      <Route path="/updateUser/:id"element={<UpdateUser/>}/>
      </Routes>
    </Router>
  );
};

export default App;
