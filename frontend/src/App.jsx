import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";

function App() {
  const [transactions, setTransactions] = useState([]);

  return (
    <BrowserRouter>
      <div className="flex bg-slate-50 min-h-screen">
        <Sidebar />
        <div className="ml-60 flex-1 p-5 md:p-8 min-w-0">
          <Routes>
            <Route path="/" element={<Dashboard transactions={transactions} setTransactions={setTransactions} />} />
            <Route path="/transactions" element={<Transactions transactions={transactions} setTransactions={setTransactions} />} />
            <Route path="/analytics" element={<Analytics transactions={transactions} />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
