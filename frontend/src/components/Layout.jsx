// src/components/Layout.jsx
// Shared layout wrapper — eliminates repeated sidebar/overlay/mobile-topbar boilerplate
import { useState, useEffect, useContext } from "react";
import Sidebar from "./Sidebar";
import { AuthContext } from "../context/AuthContext";

export default function Layout({ title, subtitle, children, rightAction }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useContext(AuthContext);

  // Close sidebar on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-[#030712]">

      {/* -------- MOBILE SIDEBAR OVERLAY -------- */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      {/* -------- SIDEBAR -------- */}
      <div
        className={`
          fixed top-0 left-0 h-full z-30 transition-transform duration-300
          md:static md:translate-x-0 md:z-auto md:h-auto md:flex-shrink-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* -------- MAIN CONTENT -------- */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* -------- MOBILE TOP BAR -------- */}
        <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#0B1120] border-b border-transparent dark:border-gray-800 shadow-sm md:hidden sticky top-0 z-10 print:hidden">
          {/* Hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
            aria-label="Open sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <h1 className="text-base font-bold text-gray-800 dark:text-gray-100">{title}</h1>

          {/* Right slot: custom action or avatar fallback */}
          {rightAction || (
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm font-semibold select-none">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
          )}
        </div>

        {/* -------- PAGE BODY -------- */}
        <div className="flex-1 p-4 sm:p-6 overflow-auto">

          {/* Desktop header (hidden on mobile since top bar handles it) */}
          <div className="hidden md:block mb-6 print:block">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{title}</h1>
            {subtitle && (
              <p className="text-gray-500 text-sm mt-0.5">{subtitle}</p>
            )}
          </div>

          {/* Mobile subtitle */}
          {subtitle && (
            <p className="text-gray-500 text-sm mb-4 md:hidden print:hidden">
              {subtitle}
            </p>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}
