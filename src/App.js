import ContactsTable from "./components/ContactsTable";
import "./App.css"
import { Routes, Route } from "react-router-dom"
import Admin from "./pages/Admin";



function App() {
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<ContactsTable />} />
        <Route path="admin" element={<Admin />} />
      </Routes>
      
    </div>
  );
}

export default App;