// src/components/Sidebar.jsx
import { useContext } from "react";
import { FaWallet, FaChartPie, FaPlusCircle, FaSignOutAlt, FaTimes, FaCoins, FaUser, FaSun, FaMoon } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ onClose }) {
  const { logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const activeClass =
    "flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/10 text-emerald-400 cursor-pointer";
  const inactiveClass =
    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-white/5 hover:text-emerald-400 cursor-pointer transition";

  const handleNav = (path) => {
    navigate(path);
    // Close drawer on mobile after navigating
    onClose?.();
  };

  return (
    // Removed `hidden md:flex` — visibility is now controlled by the parent (Dashboard)
    <div className="bg-gray-900 text-white w-64 h-full min-h-screen p-5 flex flex-col justify-between">
      <div>
        {/* -------- HEADER ROW -------- */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-bold text-emerald-400">Xpens</h1>

          {/* Close button — only visible on mobile (hidden on md+) */}
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition"
              aria-label="Close sidebar"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* -------- NAV LINKS -------- */}
        <nav className="space-y-2">
          <div
            onClick={() => handleNav("/dashboard")}
            className={isActive("/dashboard") ? activeClass : inactiveClass}
          >
            <FaWallet /> Dashboard
          </div>
          <div
            onClick={() => handleNav("/add-transaction")}
            className={isActive("/add-transaction") ? activeClass : inactiveClass}
          >
            <FaPlusCircle /> Add Transaction
          </div>
          <div
            onClick={() => handleNav("/reports")}
            className={isActive("/reports") ? activeClass : inactiveClass}
          >
            <FaChartPie /> Reports
          </div>
          <div
            onClick={() => handleNav("/budget-settings")}
            className={isActive("/budget-settings") ? activeClass : inactiveClass}
          >
            <FaCoins /> Budget
          </div>
          <div
            onClick={() => handleNav("/user-profile")}
            className={isActive("/user-profile") ? activeClass : inactiveClass}
          >
            <FaUser /> Profile
          </div>
        </nav>
      </div>

      {/* -------- THEME & LOGOUT -------- */}
      <div className="space-y-2">
        <button
          onClick={toggleTheme}
          className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white cursor-pointer transition w-full"
        >
          <div className="flex items-center gap-3">
            {theme === "dark" ? <FaSun /> : <FaMoon />}
            <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </div>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 cursor-pointer transition w-full"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
}