import { useState, useEffect } from "react";
import {
  getEnrollments, createEnrollment, updateEnrollment,
  deleteEnrollment, getStudents, getCourses
} from "../services/api";

const STATUSES = ["ACTIVE", "COMPLETED", "DROPPED", "PENDING"];
const STATUS_BADGE = {
  ACTIVE:    "badge-success",
  COMPLETED: "badge-info",
  DROPPED:   "badge-danger",
  PENDING:   "badge-warning"
};
const EMPTY = { studentId: "", courseId: "", semester: "", status: "ACTIVE" };

function Modal({ enrollment, students, courses, onClose, onSave }) {
  const [form, setForm] = useState(enrollment ? {
    studentId: enrollment.studentId || enrollment.student?.id || "",
    courseId:  enrollment.courseId  || enrollment.course?.id  || "",
    semester:  enrollment.semester  || "",
    status:    enrollment.status    || "ACTIVE",
  } : EMPTY);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.studentId) e.studentId = "Required";
    if (!form.courseId)  e.courseId  = "Required";
    if (!form.semester)  e.semester  = "Required";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      enrollment?.id
        ? await updateEnrollment(enrollment.id, form)
        : await createEnrollment(form);
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
            {enrollment ? "Edit Enrollment" : "New Enrollment"}
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Student */}
        <div className="form-group">
          <label className="form-label">Student *</label>
          <select
            className="form-control filter-select"
            style={{ width: "100%" }}
            value={form.studentId}
            onChange={e => set("studentId", e.target.value)}>
            <option value="">Select a student</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.firstName} {s.lastName} — {s.email}
              </option>
            ))}
          </select>
          {errors.studentId && (
            <div style={{ color: "var(--rose)", fontSize: 11.5, marginTop: 4 }}>
              {errors.studentId}
            </div>
          )}
        </div>

        {/* Course */}
        <div className="form-group">
          <label className="form-label">Course *</label>
          <select
            className="form-control filter-select"
            style={{ width: "100%" }}
            value={form.courseId}
            onChange={e => set("courseId", e.target.value)}>
            <option value="">Select a course</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>
                {c.courseCode} — {c.courseName}
              </option>
            ))}
          </select>
          {errors.courseId && (
            <div style={{ color: "var(--rose)", fontSize: 11.5, marginTop: 4 }}>
              {errors.courseId}
            </div>
          )}
        </div>

        {/* Semester + Status */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Semester *</label>
            <input
              className="form-control"
              value={form.semester}
              onChange={e => set("semester", e.target.value)}
              placeholder="e.g. Fall 2024" />
            {errors.semester && (
              <div style={{ color: "var(--rose)", fontSize: 11.5, marginTop: 4 }}>
                {errors.semester}
              </div>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-control filter-select"
              style={{ width: "100%" }}
              value={form.status}
              onChange={e => set("status", e.target.value)}>
              {STATUSES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit} disabled={saving}>
            {saving ? "Saving…" : enrollment ? "Update" : "Enroll"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Enrollments({ searchQuery }) {
  const [enrollments, setEnrollments] = useState([]);
  const [students,    setStudents]    = useState([]);
  const [courses,     setCourses]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [modal,       setModal]       = useState(null);
  const [deleteConfirm, setDelConf]   = useState(null);
  const [filterStatus,  setFilterS]   = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [e, s, c] = await Promise.all([
        getEnrollments(), getStudents(), getCourses()
      ]);
      setEnrollments(e); setStudents(s); setCourses(c);
    } catch (err) {
      console.error("Load error:", err);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async id => {
    try {
      await deleteEnrollment(id);
      setDelConf(null);
      load();
    } catch (err) { alert(err.message); }
  };

  const sMap = Object.fromEntries(students.map(s => [String(s.id), s]));
  const cMap = Object.fromEntries(courses.map(c  => [String(c.id), c]));

  // ✅ Helper to build full name from student object
  const fullName = (s) => {
    if (!s) return "—";
    const name = `${s.firstName || ""} ${s.lastName || ""}`.trim();
    return name || "—";
  };

  const enriched = enrollments.map(e => {
    // ✅ Try nested student object first, then fall back to sMap lookup
    const studentObj = e.student || sMap[String(e.studentId)] || null;
    const courseObj  = e.course  || cMap[String(e.courseId)]  || null;

    return {
      ...e,
      studentName: fullName(studentObj),
      courseName:  courseObj?.courseName || "—",
      courseCode:  courseObj?.courseCode || "",
    };
  });

  const filtered = enriched.filter(e => {
    const q = searchQuery?.toLowerCase() || "";
    return (
      (!q || `${e.studentName} ${e.courseName}`.toLowerCase().includes(q)) &&
      (!filterStatus || e.status === filterStatus)
    );
  });

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = enriched.filter(e => e.status === s).length;
    return acc;
  }, {});

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Enrollments</h1>
          <p className="page-subtitle">{enrollments.length} total enrollments</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setModal("add")}>
            + New Enrollment
          </button>
        </div>
      </div>

      {/* Status filter buttons */}
      <div style={{ display:"flex", gap:12, marginBottom:20,
                    flexWrap:"wrap", alignItems:"center" }}>
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilterS(f => f === s ? "" : s)}
            style={{
              padding:"7px 16px", borderRadius:20, border:"1px solid",
              cursor:"pointer", fontFamily:"'DM Sans',sans-serif",
              fontSize:12.5, fontWeight:500, transition:"all 0.15s",
              background:  filterStatus === s ? "rgba(108,99,255,0.15)" : "var(--card)",
              borderColor: filterStatus === s ? "var(--accent)"         : "var(--border)",
              color:       filterStatus === s ? "var(--accent2)"        : "var(--text2)",
            }}>
            {s} ({counts[s] || 0})
          </button>
        ))}
        {filterStatus && (
          <button className="btn btn-ghost btn-sm" onClick={() => setFilterS("")}>
            Clear ✕
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card" style={{ padding:0, overflow:"hidden" }}>
        {loading ? (
          <div style={{ padding:32 }}>
            {[1,2,3,4,5].map(i => (
              <div key={i} className="skeleton"
                style={{ height:52, borderRadius:8, marginBottom:12 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔗</div>
            <div className="empty-title">No enrollments found</div>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Semester</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(e => (
                  <tr key={e.id}>
                    <td style={{ color:"var(--text3)", fontFamily:"monospace",
                                 fontSize:12 }}>#{e.id}</td>
                    <td>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div className="avatar"
                          style={{ background:"linear-gradient(135deg,#6c63ff,#8b84ff)" }}>
                          {(e.studentName?.[0] || "?").toUpperCase()}
                        </div>
                        <span style={{ color:"var(--text)", fontWeight:500 }}>
                          {e.studentName}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ color:"var(--text)" }}>{e.courseName}</div>
                      {e.courseCode && (
                        <span className="badge badge-purple"
                          style={{ fontSize:10, marginTop:3 }}>
                          {e.courseCode}
                        </span>
                      )}
                    </td>
                    <td style={{ color:"var(--text2)" }}>{e.semester || "—"}</td>
                    <td>
                      <span className={`badge ${STATUS_BADGE[e.status] || "badge-info"}`}>
                        {e.status || "—"}
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button
                          className="btn btn-ghost btn-sm btn-icon"
                          onClick={() => setModal(e)}>✏️
                        </button>
                        <button
                          className="btn btn-danger-outline btn-sm btn-icon"
                          onClick={() => setDelConf(e)}>🗑️
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

      {/* Add / Edit Modal */}
      {modal && (
        <Modal
          enrollment={modal === "add" ? null : modal}
          students={students}
          courses={courses}
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
              <div className="modal-title">Remove Enrollment</div>
              <button className="modal-close"
                onClick={() => setDelConf(null)}>✕</button>
            </div>
            <p style={{ color:"var(--text2)", fontSize:14 }}>
              Remove{" "}
              <strong style={{ color:"var(--text)" }}>
                {deleteConfirm.studentName}
              </strong>{" "}
              from{" "}
              <strong style={{ color:"var(--text)" }}>
                {deleteConfirm.courseName}
              </strong>?
            </p>
            <div className="modal-footer">
              <button className="btn btn-outline"
                onClick={() => setDelConf(null)}>Cancel</button>
              <button
                className="btn"
                style={{ background:"var(--rose)", color:"white" }}
                onClick={() => handleDelete(deleteConfirm.id)}>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}