import { useState, useEffect } from "react";
import { getStudents, createStudent, updateStudent, deleteStudent } from "../services/api";

const AVATAR_COLORS = [
  "linear-gradient(135deg,#6c63ff,#8b84ff)",
  "linear-gradient(135deg,#00d4aa,#00b894)",
  "linear-gradient(135deg,#f59e0b,#fbbf24)",
  "linear-gradient(135deg,#f43f5e,#fb7185)",
  "linear-gradient(135deg,#38bdf8,#0ea5e9)",
];

const EMPTY = { firstName:"", lastName:"", email:"", phone:"", dateOfBirth:"", gender:"", address:"" };

function Modal({ student, onClose, onSave }) {
  const [form, setForm] = useState(student ? { ...student } : EMPTY);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.firstName?.trim()) e.firstName = "Required";
    if (!form.lastName?.trim())  e.lastName  = "Required";
    if (!form.email?.trim())     e.email     = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      student?.id ? await updateStudent(student.id, form) : await createStudent(form);
      onSave();
    } catch (err) { alert(err.message); }
    setSaving(false);
  };

  const set = (k, v) => { setForm(f => ({...f,[k]:v})); setErrors(e => ({...e,[k]:undefined})); };

  return (
    <div className="modal-overlay" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{student ? "Edit Student" : "Add New Student"}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">First Name *</label>
            <input className={`form-control ${errors.firstName?"error":""}`} value={form.firstName||""} onChange={e=>set("firstName",e.target.value)} placeholder="John" />
            {errors.firstName && <div style={{color:"var(--rose)",fontSize:11.5,marginTop:4}}>{errors.firstName}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Last Name *</label>
            <input className={`form-control ${errors.lastName?"error":""}`} value={form.lastName||""} onChange={e=>set("lastName",e.target.value)} placeholder="Doe" />
            {errors.lastName && <div style={{color:"var(--rose)",fontSize:11.5,marginTop:4}}>{errors.lastName}</div>}
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Email *</label>
          <input className={`form-control ${errors.email?"error":""}`} type="email" value={form.email||""} onChange={e=>set("email",e.target.value)} placeholder="john@email.com" />
          {errors.email && <div style={{color:"var(--rose)",fontSize:11.5,marginTop:4}}>{errors.email}</div>}
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input className="form-control" value={form.phone||""} onChange={e=>set("phone",e.target.value)} placeholder="+1 555 0000" />
          </div>
          <div className="form-group">
            <label className="form-label">Date of Birth</label>
            <input className="form-control" type="date" value={form.dateOfBirth||""} onChange={e=>set("dateOfBirth",e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Gender</label>
            <select className="form-control filter-select" style={{width:"100%"}} value={form.gender||""} onChange={e=>set("gender",e.target.value)}>
              <option value="">Select</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <input className="form-control" value={form.address||""} onChange={e=>set("address",e.target.value)} placeholder="City, Country" />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit} disabled={saving}>{saving?"Saving…":student?"Update":"Add Student"}</button>
        </div>
      </div>
    </div>
  );
}

export default function Students({ searchQuery }) {
  const [students, setStudents]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modal, setModal]           = useState(null);
  const [deleteConfirm, setDelConf] = useState(null);
  const [filterGender, setFilterG]  = useState("");

  const load = async () => {
    setLoading(true);
    try { setStudents(await getStudents()); } catch { setStudents([]); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleDelete = async id => {
    try { await deleteStudent(id); setDelConf(null); load(); } catch (err) { alert(err.message); }
  };

  const filtered = students.filter(s => {
    const q = searchQuery?.toLowerCase() || "";
    return (!q || `${s.firstName} ${s.lastName} ${s.email}`.toLowerCase().includes(q))
        && (!filterGender || s.gender === filterGender);
  });

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Students</h1><p className="page-subtitle">{students.length} registered</p></div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setModal("add")}>+ Add Student</button>
        </div>
      </div>
      <div className="filters-row">
        <select className="filter-select" value={filterGender} onChange={e => setFilterG(e.target.value)}>
          <option value="">All Genders</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
        <span style={{ marginLeft:"auto", fontSize:12.5, color:"var(--text3)" }}>{filtered.length} result{filtered.length!==1?"s":""}</span>
      </div>
      <div className="card" style={{ padding:0, overflow:"hidden" }}>
        {loading ? (
          <div style={{padding:32}}>{[1,2,3,4,5].map(i=><div key={i} className="skeleton" style={{height:48,borderRadius:8,marginBottom:12}}/>)}</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">👤</div><div className="empty-title">No students found</div></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Student</th><th>Email</th><th>Phone</th><th>Gender</th><th>DOB</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map((s,i) => (
                  <tr key={s.id}>
                    <td>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div className="avatar" style={{background:AVATAR_COLORS[i%AVATAR_COLORS.length]}}>{(s.firstName?.[0]||"?").toUpperCase()}</div>
                        <div>
                          <div style={{fontWeight:500,color:"var(--text)"}}>{s.firstName} {s.lastName}</div>
                          <div style={{fontSize:11.5,color:"var(--text3)"}}>ID #{s.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>{s.email||"—"}</td>
                    <td>{s.phone||"—"}</td>
                    <td>{s.gender?<span className={`badge ${s.gender==="MALE"?"badge-info":s.gender==="FEMALE"?"badge-purple":"badge-teal"}`}>{s.gender}</span>:"—"}</td>
                    <td>{s.dateOfBirth?new Date(s.dateOfBirth).toLocaleDateString():"—"}</td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn btn-ghost btn-sm btn-icon" onClick={()=>setModal(s)}>✏️</button>
                        <button className="btn btn-danger-outline btn-sm btn-icon" onClick={()=>setDelConf(s)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && <Modal student={modal==="add"?null:modal} onClose={()=>setModal(null)} onSave={()=>{setModal(null);load();}} />}

      {deleteConfirm && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setDelConf(null)}>
          <div className="modal" style={{maxWidth:400}}>
            <div className="modal-header"><div className="modal-title">Confirm Delete</div><button className="modal-close" onClick={()=>setDelConf(null)}>✕</button></div>
            <p style={{color:"var(--text2)",fontSize:14}}>Delete <strong style={{color:"var(--text)"}}>{deleteConfirm.firstName} {deleteConfirm.lastName}</strong>? This cannot be undone.</p>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={()=>setDelConf(null)}>Cancel</button>
              <button className="btn" style={{background:"var(--rose)",color:"white"}} onClick={()=>handleDelete(deleteConfirm.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}