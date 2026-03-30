import { useState } from "react";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Courses from "./pages/Courses";
import Enrollments from "./pages/Enrollments";
import AdminLogin from "./pages/AdminLogin";
import StudentLogin from "./pages/StudentLogin";

const NAV_ITEMS = [
  { id: "dashboard",   label: "Dashboard",   icon: "⬡", section: "OVERVIEW" },
  { id: "students",    label: "Students",    icon: "👤", section: "MANAGEMENT" },
  { id: "courses",     label: "Courses",     icon: "📚", section: "MANAGEMENT" },
  { id: "enrollments", label: "Enrollments", icon: "🔗", section: "MANAGEMENT" },
];

const PAGE_META = {
  dashboard:   { title: "Dashboard",   subtitle: "Overview & Analytics" },
  students:    { title: "Students",    subtitle: "Manage all registered students" },
  courses:     { title: "Courses",     subtitle: "Manage course catalog" },
  enrollments: { title: "Enrollments", subtitle: "Track course enrollments" },
};

const grouped = NAV_ITEMS.reduce((acc, item) => {
  if (!acc[item.section]) acc[item.section] = [];
  acc[item.section].push(item);
  return acc;
}, {});

export default function App() {
  // ✅ Auth state — null means not logged in
  const [user, setUser]     = useState(null);
  // ✅ Which login page to show: "admin" or "student"
  const [loginType, setLoginType] = useState("admin");

  const [page, setPage]     = useState("dashboard");
  const [search, setSearch] = useState("");
  const meta = PAGE_META[page];

  // ✅ Handle login
  const handleLogin = (userData) => {
    setUser(userData);
    setPage("dashboard");
  };

  // ✅ Handle logout
  const handleLogout = () => {
    setUser(null);
    setLoginType("admin");
    setPage("dashboard");
    setSearch("");
  };

  // ✅ Show login page if not logged in
  if (!user) {
    return (
      <div>
        {loginType === "admin" ? (
          <AdminLogin
            onLogin={handleLogin}
            onSwitchToStudent={() => setLoginType("student")}
          />
        ) : (
          <StudentLogin
            onLogin={handleLogin}
            onSwitchToAdmin={() => setLoginType("admin")}
          />
        )}
      </div>
    );
  }

  const renderPage = () => {
    switch (page) {
      case "dashboard":   return <Dashboard onNavigate={setPage} />;
      case "students":    return <Students searchQuery={search} />;
      case "courses":     return <Courses searchQuery={search} />;
      case "enrollments": return <Enrollments searchQuery={search} />;
      default:            return <Dashboard onNavigate={setPage} />;
    }
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">
            <div className="brand-icon">🎓</div>
            <div>
              <div className="brand-name">STUDENT COURSE PORTAL</div>
              <div className="brand-tagline">Course Manager</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {Object.entries(grouped).map(([section, items]) => (
            <div key={section}>
              <div className="nav-section-label">{section}</div>
              {items.map(item => (
                <button
                  key={item.id}
                  className={`nav-item ${page === item.id ? "active" : ""}`}
                  onClick={() => { setPage(item.id); setSearch(""); }}>
                  <span className="nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-pill">
            <div className="user-avatar">
              {/* ✅ Show first letter of username or email */}
              {(user.username || user.email || "U")[0].toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div className="user-name">
                {user.username || user.email || "User"}
              </div>
              <div className="user-role">
                {user.role === "admin" ? "Super Admin" : "Student"}
              </div>
            </div>
            {/* ✅ Logout button */}
            <button
              onClick={handleLogout}
              title="Logout"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 16,
                color: "rgba(255,255,255,0.4)",
                padding: "4px",
                borderRadius: 6,
                transition: "color 0.2s",
              }}
              onMouseEnter={e => e.target.style.color = "#f87171"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.4)"}
            >
              🚪
            </button>
          </div>
        </div>
      </aside>

      <div className="main-content">
        <header className="topbar">
          <div>
            <div className="topbar-title">{meta.title}</div>
            <div className="topbar-breadcrumb">SCM Portal / {meta.title}</div>
          </div>
          <div className="topbar-right">
            {page !== "dashboard" && (
              <div className="search-bar">
                <span>🔍</span>
                <input
                  placeholder={`Search ${meta.title.toLowerCase()}...`}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            )}
            <button className="icon-btn">🔔</button>
            <button className="icon-btn" onClick={handleLogout} title="Logout">⚙️</button>
          </div>
        </header>
        <main className="page-content">{renderPage()}</main>
      </div>
    </div>
  );
}