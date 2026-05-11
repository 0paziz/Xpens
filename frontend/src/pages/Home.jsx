// src/pages/Home.jsx
import { Link } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";
import {
  FaWallet,
  FaChartLine,
  FaBullseye,
  FaShieldAlt,
} from "react-icons/fa";

const testimonials = [
  {
    quote:
      "I used to have no idea where my salary went by month-end. Xpens helped me realize I was spending 40% of it on food delivery alone.",
    name: "Zamzam Mahad",
    role: "Bussiness Woman",
    initials: "ZM",
  },
  {
    quote:
      "Setting a transport budget and actually sticking to it felt impossible before. The visual reports make it obvious when I'm drifting.",
    name: "Bishar ",
    role: "Software Engineer",
    initials: "BI",
  },
  {
    quote:
      "Finally a tool that doesn't overwhelm me with features. I log an expense in seconds and the charts just make sense.",
    name: "Zack Mohamed",
    role: "Graduate student",
    initials: "ZM",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#030712] text-gray-900 dark:text-gray-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Serif+Display:ital@0;1&display=swap');`}</style>

      <PublicNavbar />

      {/* HERO */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-24">
        <p className="text-xs tracking-widest text-emerald-500 uppercase mb-7">
          Xpens — expense tracking
        </p>

        <h1
          className="text-[clamp(38px,6vw,58px)] font-normal leading-[1.1] tracking-tight text-gray-900 dark:text-gray-50 mb-6 max-w-lg"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          Know where your money actually goes.
        </h1>

        <p className="text-[17px] font-light text-gray-500 leading-relaxed max-w-md mb-10">
          Log expenses, set budgets, and see your spending clearly.
        </p>

        <div className="flex items-center gap-3 mb-14">
          <Link
            to="/register"
            className="px-7 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:-translate-y-px"
          >
            Start for free
          </Link>
          <Link
            to="/login"
            className="px-7 py-3 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-700 hover:text-gray-900 dark:hover:text-gray-50 text-sm rounded-lg transition-all duration-200"
          >
            Log in
          </Link>
        </div>

        <div className="flex items-center gap-10">
          {[["Free", "no credit card"], ["Secure", "JWT auth"], ["Modern", "Design"]].map(([big, small], i) => (
            <div key={i} className="flex items-center gap-10">
              {i > 0 && <div className="w-px h-8 bg-gray-200 dark:bg-gray-800" />}
              <div className="flex flex-col gap-0.5">
                <span className="text-xl font-medium text-gray-900 dark:text-gray-50 tracking-tight">{big}</span>
                <span className="text-xs text-gray-500 dark:text-gray-600">{small}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-3xl mx-auto px-6 mb-24">
        <p className="text-xs tracking-widest text-gray-600 uppercase mb-8">
          Features
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: <FaWallet />,
              title: "Expense tracking",
              desc: "Quickly log income and expenses without complicated forms.",
            },
            {
              icon: <FaBullseye />,
              title: "Budget planning",
              desc: "Set simple monthly limits and stay aware of your spending.",
            },
            {
              icon: <FaChartLine />,
              title: "Visual reports",
              desc: "See patterns and trends through clean spending charts.",
            },
            {
              icon: <FaShieldAlt />,
              title: "Secure accounts",
              desc: "Authentication and protected sessions keep your data safe.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-gray-50 dark:bg-[#0A0F1C] border border-gray-200 dark:border-gray-900 rounded-2xl p-6 hover:border-gray-300 dark:hover:border-gray-800 transition-all duration-200"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-lg mb-4">
                {feature.icon}
              </div>

              <h3 className="text-gray-900 dark:text-gray-100 text-[16px] font-medium mb-2 tracking-tight">
                {feature.title}
              </h3>

              <p className="text-sm text-gray-500 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-3xl mx-auto px-6 mb-24">
        <p className="text-xs tracking-widest text-gray-600 uppercase mb-8">How it works</p>
        <ul className="flex flex-col">
          {[
            { num: "01", title: "Create an account", desc: "Sign up with your name and email." },
            { num: "02", title: "Add your transactions", desc: "Log income and expenses as they happen. Pick a category, enter an amount, done." },
            { num: "03", title: "See the full picture", desc: "Check your reports, adjust your budgets, and make decisions with real numbers." },
          ].map((s, i) => (
            <li
              key={i}
              className={`grid grid-cols-[48px_1fr] gap-6 py-7 ${i < 2 ? "border-b border-gray-200 dark:border-gray-900" : ""} ${i === 0 ? "pt-0" : ""}`}
            >
              <span className="text-xs font-medium text-gray-500 dark:text-gray-700 tabular-nums pt-1">{s.num}</span>
              <div>
                <p className="text-[17px] font-normal text-gray-800 dark:text-gray-200 mb-1.5 tracking-tight">{s.title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-3xl mx-auto px-6 mb-24">
        <p className="text-xs tracking-widest text-gray-600 uppercase mb-8">TESTIMONIALS</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-gray-50 dark:bg-[#0A0F1C] border border-gray-200 dark:border-gray-900 rounded-2xl p-5 flex flex-col gap-4 hover:border-gray-300 dark:hover:border-gray-800 transition-all duration-200"
            >
              {/* Quote mark */}
              <span
                className="text-3xl leading-none text-emerald-500/40 select-none"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                "
              </span>

              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1">
                {t.quote}
              </p>

              <div className="flex items-center gap-3 pt-1 border-t border-gray-200 dark:border-gray-900">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-[11px] font-medium tracking-wide shrink-0">
                  {t.initials}
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200 tracking-tight">{t.name}</span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-600">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="max-w-3xl mx-auto px-6 py-7 border-t border-gray-200 dark:border-gray-900 flex items-center justify-between flex-wrap gap-4">
        <span className="text-sm text-gray-500 dark:text-gray-700">© {new Date().getFullYear()} Xpens</span>
        <div className="flex items-center gap-6">
          {[["About", "/about"], ["Contact", "/contact"], ["Log in", "/login"]].map(([label, to]) => (
            <Link key={to} to={to} className="text-sm text-gray-600 hover:text-gray-400 transition-colors duration-200">
              {label}
            </Link>
          ))}
        </div>
      </footer>
    </div>
  );
}