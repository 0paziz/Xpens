// src/pages/About.jsx
import {
  FaWallet,
  FaChartPie,
  FaBullseye,
  FaTags,
  FaUserShield,
  FaUserCog,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";

export default function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#030712] text-gray-900 dark:text-gray-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Serif+Display:ital@0;1&display=swap');`}</style>

      <PublicNavbar />

      {/* HERO */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-16">
        <p className="text-xs tracking-widest text-emerald-500 uppercase mb-7">
          About
        </p>
        <h1
          className="text-[clamp(34px,5vw,52px)] font-normal leading-[1.1] tracking-tight text-gray-900 dark:text-gray-50 mb-6 max-w-lg"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          Built to make personal finance less painful.
        </h1>
        <p className="text-[17px] font-light text-gray-500 leading-relaxed max-w-md">
          Xpens started as a final-year project with one goal — give students and young professionals a free, no-fuss way to understand their spending.
        </p>
      </section>

      {/* MISSION / WHY / WHO */}
      <section className="max-w-3xl mx-auto px-6 mb-24">
        <div className="flex flex-col">
          {[
            {
              label: "Mission",
              title: "Free finance tools for everyone",
              desc: "Most budgeting apps are too complex or locked behind a paywall. Xpens gives you clear tracking, smart budgets, and visual insights — at no cost.",
            },
            {
              label: "Why Xpens",
              title: "Less noise, more clarity",
              desc: "We stripped away everything that doesn't help you understand your money. No subscriptions, no dashboards full of widgets you never use.",
            },
            {
              label: "Who it's for",
              title: "Students, freelancers, anyone",
              desc: "Whether you're managing a tight student budget or tracking freelance income, Xpens fits without friction.",
            },
          ].map((v, i) => (
            <div
              key={i}
              className={`grid grid-cols-[120px_1fr] gap-6 py-8 ${i < 2 ? "border-b border-gray-200 dark:border-gray-900" : ""} ${i === 0 ? "pt-0" : ""}`}
            >
              <span className="text-xs font-medium text-gray-500 dark:text-gray-700 tracking-widest uppercase pt-1">{v.label}</span>
              <div>
                <p className="text-[17px] font-normal text-gray-800 dark:text-gray-200 mb-2 tracking-tight">{v.title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT YOU CAN DO */}
      <section className="max-w-3xl mx-auto px-6 mb-24">
        <p className="text-xs tracking-widest text-gray-600 uppercase mb-8">
          What you can do
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: <FaWallet />,
              title: "Track expenses",
              desc: "Keep up with your daily spending and income easily.",
            },
            {
              icon: <FaTags />,
              title: "Organize categories",
              desc: "Separate transactions into food, transport, shopping and more.",
            },
            {
              icon: <FaBullseye />,
              title: "Set budgets",
              desc: "Create monthly spending limits for better control.",
            },
            {
              icon: <FaChartPie />,
              title: "View reports",
              desc: "Understand your spending through simple visual charts.",
            },
            {
              icon: <FaUserCog />,
              title: "Manage profile",
              desc: "Update your account settings and preferences anytime.",
            },
            {
              icon: <FaUserShield />,
              title: "Secure access",
              desc: "Protected authentication keeps your account safe.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-gray-50 dark:bg-[#0A0F1C] border border-gray-200 dark:border-gray-900 rounded-2xl p-5 hover:border-gray-300 dark:hover:border-gray-800 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-lg mb-4">
                {item.icon}
              </div>

              <h3 className="text-gray-900 dark:text-gray-100 text-sm font-medium mb-2">
                {item.title}
              </h3>

              <p className="text-sm text-gray-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* TECH STACK */}
      <section className="max-w-3xl mx-auto px-6 mb-24">
        <p className="text-xs tracking-widest text-gray-600 uppercase mb-8">Tech stack</p>
        <div className="flex flex-col">
          {[
            { name: "MongoDB", role: "Database", desc: "NoSQL document storage for flexible, schema-free data." },
            { name: "Express.js", role: "Backend", desc: "Minimal Node.js framework handling the API layer." },
            { name: "React", role: "Frontend", desc: "Component-based UI library powering the interface." },
            { name: "Node.js", role: "Runtime", desc: "JavaScript runtime running all server-side logic." },
          ].map((t, i) => (
            <div
              key={i}
              className={`grid grid-cols-[120px_1fr] gap-6 py-7 ${i < 3 ? "border-b border-gray-200 dark:border-gray-900" : ""} ${i === 0 ? "pt-0" : ""}`}
            >
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 tracking-tight">{t.name}</p>
                <p className="text-xs text-emerald-500 mt-0.5">{t.role}</p>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed pt-0.5">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="max-w-3xl mx-auto px-6 py-7 border-t border-gray-200 dark:border-gray-900 flex items-center justify-between flex-wrap gap-4">
        <span className="text-sm text-gray-500 dark:text-gray-700">© {new Date().getFullYear()} Xpens</span>
        <div className="flex items-center gap-6">
          {[["Home", "/"], ["Contact", "/contact"], ["Log in", "/login"]].map(([label, to]) => (
            <Link key={to} to={to} className="text-sm text-gray-600 hover:text-gray-400 transition-colors duration-200">
              {label}
            </Link>
          ))}
        </div>
      </footer>
    </div>
  );
}