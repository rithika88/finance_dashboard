import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutGrid, ArrowLeftRight, PieChart, Sun, Moon, LogOut, Wallet, Menu, X } from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutGrid },
  { to: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/analytics", label: "Analytics", icon: PieChart },
];

function Sidebar({ user, setUser, darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const SidebarContent = (
    <>
      <div className="px-6 pb-8 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-slate-800 dark:bg-slate-100 flex items-center justify-center">
            <Wallet size={18} className="text-white dark:text-slate-900" />
          </div>
          <p className="font-bold text-lg text-slate-900 dark:text-white">Moneta</p>
        </div>
        <button onClick={() => setOpen(false)} className="md:hidden text-slate-400">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-3">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg mb-1 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`
              }
            >
              <Icon size={17} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="px-3 mb-2">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
        >
          {darkMode ? <Sun size={17} /> : <Moon size={17} />}
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      <div className="px-3 border-t border-slate-100 dark:border-slate-800 pt-4">
        <div className="px-3.5 mb-2">
          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.name}</p>
          <p className="text-xs text-slate-400 truncate">{user?.email}</p>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50">
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-slate-800 dark:bg-slate-100 flex items-center justify-center">
            <Wallet size={14} className="text-white dark:text-slate-900" />
          </div>
          <p className="font-bold text-slate-900 dark:text-white">Moneta</p>
        </div>
        <button onClick={() => setOpen(true)} className="text-slate-500 dark:text-slate-400">
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar - desktop always visible, mobile slide-in */}
      <div className={`w-64 md:w-60 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 h-screen fixed flex flex-col py-6 transition-transform z-50 ${
        open ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}>
        {SidebarContent}
      </div>
    </>
  );
}

export default Sidebar;
