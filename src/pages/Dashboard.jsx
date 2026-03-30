import { useState, useEffect } from "react";
import { getStudents, getCourses, getEnrollments } from "../services/api";

const COLORS = [
  "linear-gradient(135deg,#6c63ff,#8b84ff)",
  "linear-gradient(135deg,#00d4aa,#00b894)",
  "linear-gradient(135deg,#f59e0b,#fbbf24)",
  "linear-gradient(135deg,#f43f5e,#fb7185)",
];

function MiniBar({ data, color }) {
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 40 }}>
      {data.map((v, i) => (
        <div key={i} style={{
          flex: 1, background: color, borderRadius: 3,
          height: `${(v / max) * 100}%`, transition: "height 0.5s ease",
        }} />
      ))}
    </div>
  );
}

export default function Dashboard({ onNavigate }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ students: 0, courses: 0, enrollments: 0, active: 0 });
  const [recent, setRecent] = useState([]);
  const [topCourses, setTopCourses] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [sr, cr, er] = await Promise.allSettled([getStudents(), getCourses(), getEnrollments()]);
        const s = sr.status === "fulfilled" ? sr.value : [];
        const c = cr.status === "fulfilled" ? cr.value : [];
        const e = er.status === "fulfilled" ? er.value : [];
        setStats({ students: s.length, courses: c.length, enrollments: e.length, active: e.filter(x => x.status === "ACTIVE").length });
        setRecent([...e].sort((a, b) => new Date(b.enrollmentDate || 0) - new Date(a.enrollmentDate || 0)));
        const cc = {};
        e.forEach(en => { const n = en.courseName || en.courseId || "Unknown"; cc[n] = (cc[n] || 0) + 1; });
        setTopCourses(Object.entries(cc).sort((a, b) => b[1] - a[1]).slice(0, 5));
      } catch {}
      setLoading(false);
    })();
  }, []);

  const CARDS = [
    { label: "Total Students",  value: stats.students,    icon: "👤", color: "purple", trend: "+8%",  sparkData: [3,7,5,8,9,11, stats.students], cssVar: "var(--accent)" },
    { label: "Active Courses",  value: stats.courses,     icon: "📚", color: "teal",   trend: "+3%",  sparkData: [2,3,3,5,4,6,  stats.courses],  cssVar: "var(--teal)" },
    { label: "Enrollments",     value: stats.enrollments, icon: "🔗", color: "amber",  trend: "+12%", sparkData: [4,6,8,7,10,9, stats.enrollments], cssVar: "var(--amber)" },
    { label: "Active Enrolled", value: stats.active,      icon: "✅", color: "rose",   trend: "Live", sparkData: [1,2,3,4,5,6,  stats.active],   cssVar: "var(--rose)" },
  ];

  const maxTop = topCourses.length > 0 ? topCourses[0][1] : 1;

  return (
    <div>
      <div className="stats-grid">
        {CARDS.map(s => (
          <div className={`stat-card ${s.color}`} key={s.label}>
            <div className="stat-top">
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              <span className="stat-trend up">↑ {s.trend}</span>
            </div>
            <div className="stat-value">
              {loading ? <span className="skeleton" style={{ display:"block", width:64, height:36, borderRadius:8 }} /> : s.value}
            </div>
            <div className="stat-label" style={{ marginBottom: 12 }}>{s.label}</div>
            <MiniBar data={s.sparkData} color={s.cssVar} />
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="card span-2">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:16 }}>Recent Enrollments</div>
              <div style={{ fontSize:12.5, color:"var(--text3)", marginTop:2 }}>Latest enrollment activity</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate("enrollments")}>View All →</button>
          </div>
          {loading ? (
            [1,2,3].map(i => <div key={i} className="skeleton" style={{ height:44, borderRadius:8, marginBottom:10 }} />)
          ) : (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Student</th><th>Course</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                  {recent.length === 0 ? (
                    <tr><td colSpan={4} style={{ textAlign:"center", padding:32, color:"var(--text3)" }}>No enrollments yet</td></tr>
                  ) : recent.slice(0, 6).map((e, i) => (
                    <tr key={i}>
                      <td>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <div className="avatar" style={{ background: COLORS[i % COLORS.length] }}>
                            {(e.studentName || "?")[0].toUpperCase()}
                          </div>
                          <span style={{ color:"var(--text)" }}>{e.studentName || "—"}</span>
                        </div>
                      </td>
                      <td>{e.courseName || "—"}</td>
                      <td>{e.enrollmentDate ? new Date(e.enrollmentDate).toLocaleDateString() : "—"}</td>
                      <td>
                        <span className={`badge ${e.status === "ACTIVE" ? "badge-success" : e.status === "COMPLETED" ? "badge-info" : "badge-warning"}`}>
                          {e.status || "PENDING"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:16, marginBottom:4 }}>Top Courses</div>
          <div style={{ fontSize:12.5, color:"var(--text3)", marginBottom:20 }}>Most popular by enrollment</div>
          {loading ? [1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height:32, borderRadius:8, marginBottom:12 }} />) :
            topCourses.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">📊</div><div className="empty-title">No data yet</div></div>
            ) : topCourses.map(([name, count], i) => (
              <div key={i} style={{ marginBottom:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <span style={{ fontSize:13, color:"var(--text2)" }}>{name}</span>
                  <span style={{ fontSize:12.5, fontWeight:600, color:"var(--text)" }}>{count}</span>
                </div>
                <div className="progress">
                  <div className="progress-fill" style={{ width:`${(count/maxTop)*100}%`, background: COLORS[i % COLORS.length] }} />
                </div>
              </div>
            ))
          }
        </div>

        <div className="card">
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:16, marginBottom:4 }}>Quick Actions</div>
          <div style={{ fontSize:12.5, color:"var(--text3)", marginBottom:20 }}>Common tasks</div>
          {[
            { icon:"👤", label:"Add New Student",  desc:"Register a student",  nav:"students",    color:"var(--accent)" },
            { icon:"📚", label:"Create Course",    desc:"Add a new course",    nav:"courses",     color:"var(--teal)" },
            { icon:"🔗", label:"New Enrollment",   desc:"Enroll a student",    nav:"enrollments", color:"var(--amber)" },
          ].map(a => (
            <button key={a.label} onClick={() => onNavigate(a.nav)}
              style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 14px", borderRadius:"var(--radius2)", background:"var(--bg3)", border:"1px solid var(--border)", cursor:"pointer", transition:"all 0.18s", textAlign:"left", width:"100%", marginBottom:10 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=a.color; e.currentTarget.style.background="var(--card2)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.background="var(--bg3)"; }}>
              <span style={{ fontSize:22 }}>{a.icon}</span>
              <div>
                <div style={{ fontSize:13.5, fontWeight:500, color:"var(--text)" }}>{a.label}</div>
                <div style={{ fontSize:12, color:"var(--text3)" }}>{a.desc}</div>
              </div>
              <span style={{ marginLeft:"auto", color:"var(--text3)" }}>→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}