import { useState } from "react";

export default function StudentLogin({ onLogin, onSwitchToAdmin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    if (!/\S+@\S+\.\S+/.test(form.email)) { setError("Please enter a valid email."); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    if (form.password.length >= 6) {
      onLogin?.({ role: "student", email: form.email });
    } else {
      setError("Password must be at least 6 characters.");
    }
    setLoading(false);
  };

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0fdf4 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif",
      position: "relative", overflow: "hidden", padding: "20px",
    }}>
      {/* Background shapes */}
      <div style={{ position:"absolute", width:500, height:500, borderRadius:"50%", background:"rgba(14,165,233,0.08)", top:-200, right:-100, pointerEvents:"none" }} />
      <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%", background:"rgba(34,197,94,0.07)", bottom:-150, left:-100, pointerEvents:"none" }} />
      <div style={{ position:"absolute", width:200, height:200, borderRadius:"50%", background:"rgba(168,85,247,0.06)", top:"40%", left:"10%", pointerEvents:"none" }} />

      <div style={{ width:"100%", maxWidth:420, display:"flex", flexDirection:"column", alignItems:"center", gap:20, position:"relative", zIndex:1 }}>

        {/* Branding */}
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{
            fontSize:28, background:"linear-gradient(135deg,#0ea5e9,#22c55e)",
            borderRadius:12, width:44, height:44,
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>🎓</div>
          <span style={{ fontWeight:800, fontSize:18, color:"#0f172a" }}>
            Student Course Portal
          </span>
        </div>

        {/* Card */}
        <div style={{
          width:"100%", background:"#fff", borderRadius:24,
          padding:"36px 32px",
          boxShadow:"0 20px 60px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.06)",
          border:"1px solid rgba(0,0,0,0.06)",
        }}>

          {/* Welcome */}
          <div style={{ textAlign:"center", marginBottom:28 }}>
            <div style={{
              width:72, height:72, borderRadius:"50%",
              background:"linear-gradient(135deg,#e0f2fe,#dcfce7)",
              display:"flex", alignItems:"center", justifyContent:"center",
              margin:"0 auto 14px",
              border:"3px solid rgba(14,165,233,0.2)",
              fontSize:36,
            }}>👨‍🎓</div>
            <h1 style={{ fontSize:26, fontWeight:800, color:"#0f172a", margin:"0 0 6px" }}>
              Welcome Back!
            </h1>
            <p style={{ color:"#64748b", fontSize:13 }}>
              Sign in to view your courses and enrollments
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:16 }}>

            {/* Email */}
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <label style={{ color:"#374151", fontSize:12, fontWeight:700, letterSpacing:0.3, textTransform:"uppercase" }}>
                Student Email
              </label>
              <div style={{ position:"relative", display:"flex", alignItems:"center" }}>
                <span style={{ position:"absolute", left:12, fontSize:14, pointerEvents:"none" }}>✉️</span>
                <input
                  type="email" placeholder="student@university.edu"
                  value={form.email} onChange={(e) => set("email", e.target.value)}
                  style={{
                    width:"100%", padding:"12px 12px 12px 38px",
                    background:"#f8fafc", border:"1.5px solid #e2e8f0",
                    borderRadius:10, color:"#0f172a", fontSize:14,
                    outline:"none", boxSizing:"border-box",
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <label style={{ color:"#374151", fontSize:12, fontWeight:700, letterSpacing:0.3, textTransform:"uppercase" }}>
                  Password
                </label>
                <a href="#" style={{ color:"#0ea5e9", fontSize:11, fontWeight:600, textDecoration:"none" }}>
                  Forgot password?
                </a>
              </div>
              <div style={{ position:"relative", display:"flex", alignItems:"center" }}>
                <span style={{ position:"absolute", left:12, fontSize:14, pointerEvents:"none" }}>🔑</span>
                <input
                  type={showPass ? "text" : "password"} placeholder="••••••••"
                  value={form.password} onChange={(e) => set("password", e.target.value)}
                  style={{
                    width:"100%", padding:"12px 36px 12px 38px",
                    background:"#f8fafc", border:"1.5px solid #e2e8f0",
                    borderRadius:10, color:"#0f172a", fontSize:14,
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
                background:"#fef2f2", border:"1px solid #fecaca",
                color:"#dc2626", fontSize:12, padding:"10px 12px", borderRadius:8,
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              width:"100%", padding:"14px",
              background:"linear-gradient(135deg, #0ea5e9, #22c55e)",
              color:"#fff", fontWeight:700, fontSize:15,
              border:"none", borderRadius:12, cursor:"pointer",
              marginTop:4, opacity: loading ? 0.8 : 1,
              boxShadow:"0 4px 16px rgba(14,165,233,0.3)",
            }}>
              {loading ? "Signing in..." : "Sign In to Portal"}
            </button>
          </form>

          {/* Features */}
          <div style={{
            display:"flex", justifyContent:"space-around",
            marginTop:24, padding:"16px 0",
            borderTop:"1px solid #f1f5f9",
            borderBottom:"1px solid #f1f5f9",
          }}>
            {[["📚","View Courses"],["📋","Enrollments"],["📊","Progress"]].map(([icon, label]) => (
              <div key={label} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                <span style={{ fontSize:18 }}>{icon}</span>
                <span style={{ fontSize:11, color:"#64748b", fontWeight:600 }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ display:"flex", alignItems:"center", gap:10, margin:"20px 0 16px" }}>
            <span style={{ flex:1, height:1, background:"#f1f5f9" }} />
            <span style={{ color:"#94a3b8", fontSize:12 }}>or</span>
            <span style={{ flex:1, height:1, background:"#f1f5f9" }} />
          </div>

          {/* ✅ Switch to Admin Login */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            <span style={{ color:"#64748b", fontSize:13 }}>Are you an admin?</span>
            <button
              type="button"
              onClick={() => onSwitchToAdmin?.()}
              style={{
                background:"none", border:"none", cursor:"pointer", padding:0,
                color:"#0ea5e9", fontSize:13, fontWeight:700,
              }}>
              Admin Login →
            </button>
          </div>

        </div>

        <p style={{ color:"#94a3b8", fontSize:12 }}>
          © 2026 Student Course Management Portal
        </p>
      </div>
    </div>
  );
}