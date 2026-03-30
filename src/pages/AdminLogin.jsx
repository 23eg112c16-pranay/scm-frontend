import { useState } from "react";

export default function AdminLogin({ onLogin, onSwitchToStudent }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.username || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    if (form.username === "admin" && form.password === "admin123") {
      onLogin?.({ role: "admin", username: form.username });
    } else {
      setError("Invalid credentials. Try admin / admin123");
    }
    setLoading(false);
  };

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif",
      position: "relative", overflow: "hidden", padding: "20px",
    }}>
      {/* Background grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(99,102,241,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.07) 1px, transparent 1px)",
        backgroundSize: "40px 40px", pointerEvents: "none",
      }} />

      {/* Orbs */}
      <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%", background:"rgba(99,102,241,0.15)", top:-100, left:-100, filter:"blur(80px)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", width:300, height:300, borderRadius:"50%", background:"rgba(168,85,247,0.12)", bottom:-80, right:-80, filter:"blur(80px)", pointerEvents:"none" }} />

      <div style={{
        display: "flex", width: "100%", maxWidth: 900, minHeight: 560,
        borderRadius: 24, overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
        position: "relative", zIndex: 1,
      }}>

        {/* ── Left Panel ── */}
        <div style={{
          flex: 1,
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)",
          padding: "48px 40px", display: "flex", flexDirection: "column",
          justifyContent: "space-between",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{
              fontSize:22, background:"rgba(255,255,255,0.15)",
              width:40, height:40, borderRadius:10,
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>⚙</div>
            <span style={{ color:"#fff", fontWeight:700, fontSize:16 }}>SCM Portal</span>
          </div>

          <div>
            <h1 style={{
              color:"#fff", fontSize:42, fontWeight:800,
              lineHeight:1.1, margin:"0 0 16px", letterSpacing:-1,
            }}>
              Admin<br />Control<br />Center
            </h1>
            <p style={{ color:"rgba(255,255,255,0.6)", fontSize:14, lineHeight:1.6, maxWidth:260 }}>
              Manage students, courses, and enrollments from one powerful dashboard.
            </p>
          </div>

          <div style={{ display:"flex", gap:12 }}>
            {[["Students","4"],["Courses","6"],["Enrollments","12"]].map(([label, val]) => (
              <div key={label} style={{
                flex:1, background:"rgba(255,255,255,0.08)", borderRadius:12,
                padding:"14px 12px", textAlign:"center",
                border:"1px solid rgba(255,255,255,0.1)",
              }}>
                <div style={{ color:"#fff", fontSize:24, fontWeight:800 }}>{val}</div>
                <div style={{ color:"rgba(255,255,255,0.5)", fontSize:11, marginTop:2, textTransform:"uppercase", letterSpacing:0.5 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div style={{
          flex: 1, background: "#111118",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "48px 40px",
        }}>
          <div style={{ width:"100%", maxWidth:340 }}>

            <div style={{
              display:"inline-block", background:"rgba(99,102,241,0.15)", color:"#818cf8",
              fontSize:10, fontWeight:700, letterSpacing:2, padding:"4px 10px",
              borderRadius:20, border:"1px solid rgba(99,102,241,0.3)", marginBottom:16,
            }}>ADMINISTRATOR</div>

            <h2 style={{ color:"#fff", fontSize:28, fontWeight:800, margin:"0 0 6px" }}>
              Sign In
            </h2>
            <p style={{ color:"rgba(255,255,255,0.4)", fontSize:13, marginBottom:28 }}>
              Enter your credentials to access the portal
            </p>

            <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:16 }}>

              {/* Username */}
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                <label style={{ color:"rgba(255,255,255,0.6)", fontSize:12, fontWeight:600 }}>
                  Username
                </label>
                <div style={{ position:"relative", display:"flex", alignItems:"center" }}>
                  <span style={{ position:"absolute", left:12, fontSize:14, pointerEvents:"none" }}>👤</span>
                  <input
                    type="text" placeholder="admin" value={form.username}
                    onChange={(e) => set("username", e.target.value)}
                    style={{
                      width:"100%", padding:"12px 12px 12px 36px",
                      background:"rgba(255,255,255,0.05)",
                      border:"1px solid rgba(255,255,255,0.1)",
                      borderRadius:10, color:"#fff", fontSize:14,
                      outline:"none", boxSizing:"border-box",
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                <label style={{ color:"rgba(255,255,255,0.6)", fontSize:12, fontWeight:600 }}>
                  Password
                </label>
                <div style={{ position:"relative", display:"flex", alignItems:"center" }}>
                  <span style={{ position:"absolute", left:12, fontSize:14, pointerEvents:"none" }}>🔒</span>
                  <input
                    type={showPass ? "text" : "password"} placeholder="••••••••"
                    value={form.password} onChange={(e) => set("password", e.target.value)}
                    style={{
                      width:"100%", padding:"12px 36px 12px 36px",
                      background:"rgba(255,255,255,0.05)",
                      border:"1px solid rgba(255,255,255,0.1)",
                      borderRadius:10, color:"#fff", fontSize:14,
                      outline:"none", boxSizing:"border-box",
                    }}
                  />
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    style={{ position:"absolute", right:10, background:"none", border:"none", cursor:"pointer", fontSize:14, padding:4 }}>
                    {showPass ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)",
                  color:"#fca5a5", fontSize:12, padding:"10px 12px", borderRadius:8,
                }}>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={loading} style={{
                width:"100%", padding:"13px",
                background:"linear-gradient(135deg, #6366f1, #8b5cf6)",
                color:"#fff", fontWeight:700, fontSize:14,
                border:"none", borderRadius:10, cursor:"pointer",
                marginTop:4, opacity: loading ? 0.75 : 1,
              }}>
                {loading ? "Signing in..." : "Sign In →"}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display:"flex", alignItems:"center", gap:10, margin:"20px 0" }}>
              <span style={{ flex:1, height:1, background:"rgba(255,255,255,0.08)" }} />
              <span style={{ color:"rgba(255,255,255,0.3)", fontSize:12 }}>or</span>
              <span style={{ flex:1, height:1, background:"rgba(255,255,255,0.08)" }} />
            </div>

            {/* ✅ Switch to Student Login */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              <span style={{ color:"rgba(255,255,255,0.4)", fontSize:13 }}>Are you a student?</span>
              <button
                type="button"
                onClick={() => onSwitchToStudent?.()}
                style={{
                  background:"none", border:"none", cursor:"pointer", padding:0,
                  color:"#818cf8", fontSize:13, fontWeight:600,
                }}>
                Student Login →
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}