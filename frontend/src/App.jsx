import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { getTransactions } from "./utils/api";

function PageFade({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function AppRoutes({ user, transactions, setTransactions }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageFade><Dashboard transactions={transactions} setTransactions={setTransactions} user={user} /></PageFade>} />
        <Route path="/transactions" element={<PageFade><Transactions transactions={transactions} setTransactions={setTransactions} /></PageFade>} />
        <Route path="/analytics" element={<PageFade><Analytics transactions={transactions} /></PageFade>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

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
              <div className="flex min-h-screen transition-colors" style={{ background: "var(--paper)" }}>
                <Sidebar user={user} setUser={setUser} darkMode={darkMode} setDarkMode={setDarkMode} />
                <div className="md:ml-60 flex-1 p-4 pt-20 md:p-8 min-w-0">
                  {loading ? (
                    <div className="flex items-center gap-2 text-sm" style={{ color: "var(--ink-faint)" }}>
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                      Loading your ledger…
                    </div>
                  ) : (
                    <AppRoutes user={user} transactions={transactions} setTransactions={setTransactions} />
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
