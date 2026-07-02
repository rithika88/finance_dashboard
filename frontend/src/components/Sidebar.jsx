import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard", icon: "▦" },
  { to: "/transactions", label: "Transactions", icon: "⇄" },
  { to: "/analytics", label: "Analytics", icon: "◎" },
];

function Sidebar() {
  return (
    <div className="w-60 bg-white border-r border-slate-100 h-screen fixed flex flex-col py-6">
      <div className="px-6 pb-8 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-500 flex items-center justify-center text-lg">💼</div>
        <p className="font-bold text-lg text-slate-900">FinanceIQ</p>
      </div>

      <nav className="flex-1 px-3">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-lg mb-1 text-sm font-medium transition-colors ${
                isActive ? "bg-violet-50 text-violet-600 font-semibold" : "text-slate-500 hover:bg-slate-50"
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;
