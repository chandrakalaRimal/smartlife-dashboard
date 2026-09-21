import { NavLink } from "react-router-dom";

function Sidebar() {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "text-teal-300 font-medium"
      : "text-slate-400 hover:text-teal-300 transition";

  return (
    <aside className="w-64 min-h-screen border-r border-slate-800 p-6">
      <div>
        <h2 className="text-xl font-bold text-white">SmartLife</h2>
        <p className="text-sm text-slate-400">Personal dashboard</p>
      </div>

      <nav className="mt-10 flex flex-col gap-3">
        <NavLink end className={navClass} to="/">
          Dashboard
        </NavLink>

        <NavLink className={navClass} to="/tasks">
          Tasks
        </NavLink>

        <NavLink className={navClass} to="/expenses">
          Expenses
        </NavLink>

        <NavLink className={navClass} to="/notes">
          Notes
        </NavLink>

        <NavLink className={navClass} to="/assistant">
          Assistant
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
