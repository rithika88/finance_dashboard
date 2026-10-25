import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, ArrowLeftRight, PieChart, Sun, Moon, LogOut, Wallet, Menu, X } from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutGrid },
  { to: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/analytics", label: "Analytics", icon: PieChart },
];

function Sidebar({ user, setUser, darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const isActivePath = (to) => (to === "/" ? location.pathname === "/" : location.pathname.startsWith(to));

  const SidebarContent = (
    <>
      <div className="px-6 pb-8 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--ink)" }}>
            <Wallet size={17} style={{ color: "var(--paper)" }} />
          </div>
          <p className="font-display font-semibold text-lg" style={{ color: "var(--ink)" }}>Moneta</p>
        </div>
        <button onClick={() => setOpen(false)} className="md:hidden" style={{ color: "var(--ink-faint)" }}>
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-3 relative">
        {navItems.map(item => {
          const Icon = item.icon;
          const active = isActivePath(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setOpen(false)}
              className="relative flex items-center gap-3 px-3.5 py-2.5 rounded-lg mb-1 text-sm font-medium transition-colors"
              style={{ color: active ? "var(--ink)" : "var(--ink-soft)", fontWeight: active ? 600 : 500 }}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 rounded-lg -z-10"
                  style={{ background: "var(--brass-tint)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <Icon size={17} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="px-3 mb-2">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          style={{ color: "var(--ink-soft)" }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={darkMode ? "sun" : "moon"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="inline-flex"
            >
              {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            </motion.span>
          </AnimatePresence>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      <div className="px-3 pt-4" style={{ borderTop: "1px solid var(--hairline)" }}>
        <div className="px-3.5 mb-2">
          <p className="text-sm font-medium truncate" style={{ color: "var(--ink)" }}>{user?.name}</p>
          <p className="text-xs truncate" style={{ color: "var(--ink-faint)" }}>{user?.email}</p>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors" style={{ color: "var(--ink-soft)" }}>
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 flex items-center justify-between px-4 z-40" style={{ background: "var(--paper-surface)", borderBottom: "1px solid var(--hairline)" }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--ink)" }}>
            <Wallet size={13} style={{ color: "var(--paper)" }} />
          </div>
          <p className="font-display font-semibold" style={{ color: "var(--ink)" }}>Moneta</p>
        </div>
        <button onClick={() => setOpen(true)} style={{ color: "var(--ink-soft)" }}>
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/40 z-40"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - desktop always visible, mobile slide-in */}
      <div
        className={`w-64 md:w-60 h-screen fixed flex flex-col py-6 z-50 transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
        style={{ background: "var(--paper-surface)", borderRight: "1px solid var(--hairline)" }}
      >
        {SidebarContent}
      </div>
    </>
  );
}

export default Sidebar;
