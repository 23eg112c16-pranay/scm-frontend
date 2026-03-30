import { useState, useEffect } from "react";
import { getCourses, createCourse, updateCourse, deleteCourse } from "../services/api";

const ICONS = ["📐","🔬","💻","🌍","🎨","📖","🧮","🎭","🏛️","🔭"];
const CAT_BADGE = {
  SCIENCE:    "badge-teal",
  MATH:       "badge-purple",
  TECHNOLOGY: "badge-info",
  ARTS:       "badge-warning",
  HUMANITIES: "badge-success"
};
const EMPTY = {
  courseCode:    "",
  courseName:    "",
  description:   "",
  credits:       "",
  instructor:    "",
  category:      "",
  maxEnrollment: "",
  duration:      ""
};
const CATS   = ["SCIENCE","MATH","TECHNOLOGY","ARTS","HUMANITIES"];
const COLORS = [
  "linear-gradient(135deg,#6c63ff,#8b84ff)",
  "linear-gradient(135deg,#00d4aa,#00b894)",
  "linear-gradient(135deg,#f59e0b,#fbbf24)",
  "linear-gradient(135deg,#f43f5e,#fb7185)"
];

function Modal({ course, onClose, onSave }) {
  const [form, setForm] = useState(course ? { ...course } : EMPTY);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.courseCode?.trim()) e.courseCode  = "Required";
    if (!form.courseName?.trim()) e.courseName  = "Required";
    if (!form.instructor?.trim()) e.instructor  = "Required";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      course?.id
        ? await updateCourse(course.id, form)
        : await createCourse(form);
      onSave();
    } catch (err) { alert(err.message); }
    setSaving(false);
  };

  const set = (k, v) => {
    setForm(f  => ({ ...f,  [k]: v }));
    setErrors(e => ({ ...e, [k]: undefined }));
  };

  return (
    <div className="modal-overlay"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">
            {course ? "Edit Course" : "Create Course"}
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Course Code + Credits */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Course Code *</label>
            <input
              className={`form-control ${errors.courseCode ? "error" : ""}`}
              value={form.courseCode || ""}
              onChange={e => set("courseCode", e.target.value)}
              placeholder="CS101" />
            {errors.courseCode && (
              <div style={{ color:"var(--rose)", fontSize:11.5, marginTop:4 }}>
                {errors.courseCode}
              </div>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Credits</label>
            <input
              className="form-control"
              type="number" min="1" max="10"
              value={form.credits || ""}
              onChange={e => set("credits", e.target.value)}
              placeholder="3" />
          </div>
        </div>

        {/* Course Name */}
        <div className="form-group">
          <label className="form-label">Course Name *</label>
          <input
            className={`form-control ${errors.courseName ? "error" : ""}`}
            value={form.courseName || ""}
            onChange={e => set("courseName", e.target.value)}
            placeholder="Introduction to Computer Science" />
          {errors.courseName && (
            <div style={{ color:"var(--rose)", fontSize:11.5, marginTop:4 }}>
              {errors.courseName}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows={3}
            value={form.description || ""}
            onChange={e => set("description", e.target.value)}
            placeholder="Brief course description..."
            style={{ resize:"vertical" }} />
        </div>

        {/* Instructor + Category */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Instructor *</label>
            <input
              className={`form-control ${errors.instructor ? "error" : ""}`}
              value={form.instructor || ""}
              onChange={e => set("instructor", e.target.value)}
              placeholder="Dr. Smith" />
            {errors.instructor && (
              <div style={{ color:"var(--rose)", fontSize:11.5, marginTop:4 }}>
                {errors.instructor}
              </div>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-control filter-select"
              style={{ width:"100%" }}
              value={form.category || ""}
              onChange={e => set("category", e.target.value)}>
              <option value="">Select</option>
              {/* ✅ key and value on every option */}
              {CATS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Max Enrollment + Duration */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Max Enrollment</label>
            <input
              className="form-control"
              type="number" min="1"
              value={form.maxEnrollment || ""}
              onChange={e => set("maxEnrollment", e.target.value)}
              placeholder="30" />
          </div>
          <div className="form-group">
            <label className="form-label">Duration (weeks)</label>
            <input
              className="form-control"
              type="number" min="1"
              value={form.duration || ""}
              onChange={e => set("duration", e.target.value)}
              placeholder="16" />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit} disabled={saving}>
            {saving ? "Saving…" : course ? "Update" : "Create Course"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Courses({ searchQuery }) {
  const [courses, setCourses]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modal, setModal]           = useState(null);
  const [deleteConfirm, setDelConf] = useState(null);
  const [filterCat, setFilterCat]   = useState("");
  const [viewMode, setViewMode]     = useState("table");

  const load = async () => {
    setLoading(true);
    try { setCourses(await getCourses()); } catch { setCourses([]); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async id => {
    try {
      await deleteCourse(id);
      setDelConf(null);
      load();
    } catch (err) { alert(err.message); }
  };

  const filtered = courses.filter(c => {
    const q = searchQuery?.toLowerCase() || "";
    return (
      (!q || `${c.courseName} ${c.courseCode} ${c.instructor}`
        .toLowerCase().includes(q)) &&
      (!filterCat || c.category === filterCat)
    );
  });

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Courses</h1>
          <p className="page-subtitle">{courses.length} courses in catalog</p>
        </div>
        <div className="page-header-actions">
          <div className="tabs">
            <button
              className={`tab ${viewMode === "table" ? "active" : ""}`}
              onClick={() => setViewMode("table")}>☰ Table
            </button>
            <button
              className={`tab ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}>⊞ Grid
            </button>
          </div>
          <button className="btn btn-primary" onClick={() => setModal("add")}>
            + New Course
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-row">
        <select className="filter-select" value={filterCat}
          onChange={e => setFilterCat(e.target.value)}>
          <option value="">All Categories</option>
          {/* ✅ key and value on every option */}
          {CATS.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <span style={{ marginLeft:"auto", fontSize:12.5, color:"var(--text3)" }}>
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table View */}
      {viewMode === "table" ? (
        <div className="card" style={{ padding:0, overflow:"hidden" }}>
          {loading ? (
            <div style={{ padding:32 }}>
              {[1,2,3,4].map(i => (
                <div key={i} className="skeleton"
                  style={{ height:52, borderRadius:8, marginBottom:12 }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <div className="empty-title">No courses found</div>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Code</th>
                    <th>Instructor</th>
                    <th>Category</th>
                    <th>Credits</th>
                    <th>Max</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, i) => (
                    <tr key={c.id}>
                      <td>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <div style={{
                            width:36, height:36, borderRadius:8,
                            background:"var(--bg3)",
                            border:"1px solid var(--border)",
                            display:"flex", alignItems:"center",
                            justifyContent:"center",
                            fontSize:18, flexShrink:0
                          }}>
                            {ICONS[i % ICONS.length]}
                          </div>
                          <div>
                            <div style={{ fontWeight:500, color:"var(--text)" }}>
                              {c.courseName || "—"}
                            </div>
                            {c.description && (
                              <div style={{
                                fontSize:11.5, color:"var(--text3)",
                                maxWidth:220, overflow:"hidden",
                                textOverflow:"ellipsis", whiteSpace:"nowrap"
                              }}>
                                {c.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-purple">
                          {c.courseCode || "—"}
                        </span>
                      </td>
                      <td>{c.instructor || "—"}</td>
                      <td>
                        {c.category
                          ? <span className={`badge ${CAT_BADGE[c.category] || "badge-info"}`}>
                              {c.category}
                            </span>
                          : "—"}
                      </td>
                      <td style={{ color:"var(--text)", fontWeight:600 }}>
                        {c.credits || "—"}
                      </td>
                      <td>{c.maxEnrollment || "—"}</td>
                      <td>
                        <div className="actions-cell">
                          <button
                            className="btn btn-ghost btn-sm btn-icon"
                            onClick={() => setModal(c)}>✏️
                          </button>
                          <button
                            className="btn btn-danger-outline btn-sm btn-icon"
                            onClick={() => setDelConf(c)}>🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      ) : (
        /* Grid View */
        loading ? (
          <div style={{
            display:"grid",
            gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",
            gap:16
          }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="skeleton" style={{ height:180, borderRadius:12 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <div className="empty-title">No courses found</div>
            </div>
          </div>
        ) : (
          <div style={{
            display:"grid",
            gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",
            gap:16
          }}>
            {filtered.map((c, i) => (
              <div className="card" key={c.id}
                style={{ transition:"transform 0.2s,box-shadow 0.2s", cursor:"default" }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "var(--shadow)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = "";
                }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
                  <div style={{ fontSize:28 }}>{ICONS[i % ICONS.length]}</div>
                  {c.category && (
                    <span className={`badge ${CAT_BADGE[c.category] || "badge-info"}`}>
                      {c.category}
                    </span>
                  )}
                </div>
                <div style={{
                  fontFamily:"'Syne',sans-serif", fontWeight:700,
                  fontSize:15, color:"var(--text)", marginBottom:4
                }}>
                  {c.courseName || "—"}
                </div>
                <div style={{
                  fontSize:12, color:"var(--text3)",
                  marginBottom:12, minHeight:32
                }}>
                  {c.description || "No description"}
                </div>
                <div style={{
                  display:"flex", gap:16, fontSize:12.5,
                  color:"var(--text3)", marginBottom:14
                }}>
                  <span>👤 {c.instructor || "—"}</span>
                  <span>⭐ {c.credits    || "—"} cr</span>
                  <span>👥 {c.maxEnrollment || "∞"}</span>
                </div>
                <div className="divider" style={{ margin:"12px 0" }} />
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <span className="badge badge-purple" style={{ fontSize:11 }}>
                    {c.courseCode || "—"}
                  </span>
                  <div style={{ marginLeft:"auto", display:"flex", gap:6 }}>
                    <button
                      className="btn btn-ghost btn-sm btn-icon"
                      onClick={() => setModal(c)}>✏️
                    </button>
                    <button
                      className="btn btn-danger-outline btn-sm btn-icon"
                      onClick={() => setDelConf(c)}>🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Add / Edit Modal */}
      {modal && (
        <Modal
          course={modal === "add" ? null : modal}
          onClose={() => setModal(null)}
          onSave={() => { setModal(null); load(); }}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="modal-overlay"
          onClick={e => e.target === e.currentTarget && setDelConf(null)}>
          <div className="modal" style={{ maxWidth:400 }}>
            <div className="modal-header">
              <div className="modal-title">Delete Course</div>
              <button className="modal-close" onClick={() => setDelConf(null)}>✕</button>
            </div>
            <p style={{ color:"var(--text2)", fontSize:14 }}>
              Delete{" "}
              <strong style={{ color:"var(--text)" }}>
                {deleteConfirm.courseName}
              </strong>?
              All related enrollments may be affected.
            </p>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setDelConf(null)}>
                Cancel
              </button>
              <button
                className="btn"
                style={{ background:"var(--rose)", color:"white" }}
                onClick={() => handleDelete(deleteConfirm.id)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}