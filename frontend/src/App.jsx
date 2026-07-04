import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { getTransactions } from "./utils/api";

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    getTransactions()
      .then(data => setTransactions(data))
      .catch(err => console.error("Failed to load transactions:", err))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login setUser={setUser} />} />
        <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup setUser={setUser} />} />
        <Route
          path="/*"
          element={
            !user ? (
              <Navigate to="/login" />
            ) : (
              <div className="flex bg-slate-50 min-h-screen">
                <Sidebar user={user} setUser={setUser} />
                <div className="ml-60 flex-1 p-5 md:p-8 min-w-0">
                  {loading ? (
                    <p className="text-slate-400 text-sm">Loading...</p>
                  ) : (
                    <Routes>
                      <Route path="/" element={<Dashboard transactions={transactions} setTransactions={setTransactions} />} />
                      <Route path="/transactions" element={<Transactions transactions={transactions} setTransactions={setTransactions} />} />
                      <Route path="/analytics" element={<Analytics transactions={transactions} />} />
                    </Routes>
                  )}
                </div>
              </div>
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
