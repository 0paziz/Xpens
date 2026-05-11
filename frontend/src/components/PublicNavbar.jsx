// src/components/PublicNavbar.jsx
import { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaSun, FaMoon } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";

export default function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-[#030712]/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-900">
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link to="/" className="text-sm font-medium text-gray-900 dark:text-gray-50 tracking-tight">
            Xpens
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm transition-colors duration-200 ${
                  isActive(link.path)
                    ? "text-emerald-500"
                    : "text-gray-600 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="text-gray-600 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <FaSun className="w-4 h-4" /> : <FaMoon className="w-4 h-4" />}
            </button>
            <Link
              to="/login"
              className="text-sm text-gray-600 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:-translate-y-px"
            >
              Get started
            </Link>
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="text-gray-600 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <FaSun className="w-4 h-4" /> : <FaMoon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-gray-600 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <FaTimes className="w-4 h-4" /> : <FaBars className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-900 bg-white dark:bg-[#030712]">
          <div className="max-w-3xl mx-auto px-6 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`py-2.5 text-sm transition-colors duration-200 ${
                  isActive(link.path)
                    ? "text-emerald-500"
                    : "text-gray-600 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 mt-2 border-t border-gray-200 dark:border-gray-900 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="py-2.5 text-sm text-gray-600 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200"
              >
                Log in
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg text-center transition-all duration-200"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}