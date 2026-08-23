import { useEffect, useState } from "react";
import API from "../services/api";

function Areas() {
  const [areas, setAreas] = useState([]);
  const [zones, setZones] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    pincode: "",
    zone: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // FETCH AREAS AND ZONES
  // =====================================================

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [areasResponse, zonesResponse] =
        await Promise.all([
          API.get("/areas"),
          API.get("/zones"),
        ]);

      setAreas(areasResponse.data.areas || []);
      setZones(zonesResponse.data.zones || []);
    } catch (error) {
      console.error("Error loading areas:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load areas"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setForm({
      name: "",
      pincode: "",
      zone: "",
    });

    setEditingId(null);
    setShowForm(false);
  };

  // =====================================================
  // OPEN ADD FORM
  // =====================================================

  const handleAdd = () => {
    setForm({
      name: "",
      pincode: "",
      zone: "",
    });

    setEditingId(null);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  // =====================================================
  // CREATE / UPDATE AREA
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Validate area name
    if (!form.name.trim()) {
      setError("Area name is required");
      return;
    }

    // Validate pincode
    if (!form.pincode.trim()) {
      setError("Pincode is required");
      return;
    }

    if (!/^\d{6}$/.test(form.pincode.trim())) {
      setError("Pincode must contain exactly 6 digits");
      return;
    }

    // Validate zone
    if (!form.zone) {
      setError("Please select a zone");
      return;
    }

    try {
      setSaving(true);

      const data = {
        name: form.name.trim(),
        pincode: form.pincode.trim(),
        zone: form.zone,
      };

      const wasEditing = Boolean(editingId);

      if (wasEditing) {
        await API.put(
          `/areas/${editingId}`,
          data
        );
      } else {
        await API.post(
          "/areas",
          data
        );
      }

      resetForm();

      setSuccess(
        wasEditing
          ? "Area updated successfully"
          : "Area created successfully"
      );

      await fetchData();
    } catch (error) {
      console.error(
        "Error saving area:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to save area"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // EDIT AREA
  // =====================================================

  const handleEdit = (area) => {
    setEditingId(area._id);

    setForm({
      name: area.name || "",
      pincode: area.pincode || "",
      zone:
        area.zone?._id ||
        area.zone ||
        "",
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  };

  // =====================================================
  // DELETE AREA
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this area?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await API.delete(
        `/areas/${id}`
      );

      setSuccess(
        "Area deleted successfully"
      );

      await fetchData();
    } catch (error) {
      console.error(
        "Error deleting area:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete area"
      );
    }
  };

  // =====================================================
  // TOGGLE ACTIVE / INACTIVE
  // =====================================================

  const handleToggleStatus = async (area) => {
    try {
      setError("");
      setSuccess("");

      await API.put(
        `/areas/${area._id}`,
        {
          isActive: !area.isActive,
        }
      );

      setSuccess(
        area.isActive
          ? "Area deactivated successfully"
          : "Area activated successfully"
      );

      await fetchData();
    } catch (error) {
      console.error(
        "Error updating area status:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update area status"
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="details-card">
        <h1>Areas</h1>
        <p>Loading areas...</p>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="users-page">

      {/* ================================================= */}
      {/* PAGE HEADER */}
      {/* ================================================= */}

      <div className="users-page-header">

        <div>
          <h1>Areas</h1>

          <p>
            Manage delivery areas and their zones
          </p>
        </div>

        <strong>
          Total Areas: {areas.length}
        </strong>

      </div>

      {/* ================================================= */}
      {/* MESSAGES */}
      {/* ================================================= */}

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {success && (
        <p className="success-message">
          {success}
        </p>
      )}

      {/* ================================================= */}
      {/* ADD AREA BUTTON */}
      {/* ================================================= */}

      <div className="quick-actions">

        <button
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              handleAdd();
            }
          }}
        >
          {showForm
            ? "Cancel"
            : "+ Add Area"}
        </button>

      </div>

      {/* ================================================= */}
      {/* AREA FORM */}
      {/* ================================================= */}

      {showForm && (
        <div className="details-card">

          <h2>
            {editingId
              ? "Edit Area"
              : "Create Area"}
          </h2>

          <p>
            {editingId
              ? "Update the area details below."
              : "Add a new delivery area and assign it to a zone."}
          </p>

          <form
            onSubmit={handleSubmit}
            className="order-form"
          >

            {/* AREA NAME */}

            <div className="form-group">

              <label>
                Area Name *
              </label>

              <input
                type="text"
                name="name"
                placeholder="Example: Manappakkam"
                value={form.name}
                onChange={handleChange}
                required
              />

            </div>

            {/* PINCODE */}

            <div className="form-group">

              <label>
                Pincode *
              </label>

              <input
                type="text"
                name="pincode"
                placeholder="Example: 600125"
                value={form.pincode}
                onChange={handleChange}
                maxLength={6}
                inputMode="numeric"
                required
              />

            </div>

            {/* ZONE */}

            <div className="form-group">

              <label>
                Zone *
              </label>

              <select
                name="zone"
                value={form.zone}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select Zone
                </option>

                {zones.map((zone) => (
                  <option
                    key={zone._id}
                    value={zone._id}
                  >
                    {zone.name}
                    {zone.code
                      ? ` (${zone.code})`
                      : ""}
                  </option>
                ))}

              </select>

              {zones.length === 0 && (
                <small>
                  No zones available. Please create a
                  zone first.
                </small>
              )}

            </div>

            {/* FORM ACTIONS */}

            <div className="form-actions">

              <button
                type="button"
                className="secondary-button"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={saving || zones.length === 0}
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Area"
                  : "Create Area"}
              </button>

            </div>

          </form>

        </div>
      )}

      {/* ================================================= */}
      {/* AREAS TABLE */}
      {/* ================================================= */}

      <div className="details-card">

        <div className="content-card-header">

          <div>
            <h2>
              All Areas
            </h2>

            <p>
              {areas.length} area
              {areas.length !== 1
                ? "s"
                : ""}
            </p>
          </div>

        </div>

        {/* ================================================= */}
        {/* EMPTY STATE */}
        {/* ================================================= */}

        {areas.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              📍
            </div>

            <h3>
              No areas found
            </h3>

            <p>
              Create your first delivery area.
            </p>

            <button
              className="primary-button"
              onClick={handleAdd}
            >
              + Add Area
            </button>

          </div>

        ) : (

          /* ================================================= */
          /* TABLE */
          /* ================================================= */

          <div className="users-table-container">

            <table className="users-table">

              <thead>

                <tr>
                  <th>#</th>
                  <th>Area Name</th>
                  <th>Pincode</th>
                  <th>Zone</th>
                  <th>Zone Code</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>

                {areas.map(
                  (area, index) => (
                    <tr key={area._id}>

                      {/* NUMBER */}

                      <td>
                        {index + 1}
                      </td>

                      {/* AREA */}

                      <td>
                        <strong>
                          {area.name}
                        </strong>
                      </td>

                      {/* PINCODE */}

                      <td>
                        {area.pincode}
                      </td>

                      {/* ZONE NAME */}

                      <td>
                        {area.zone?.name ||
                          "N/A"}
                      </td>

                      {/* ZONE CODE */}

                      <td>
                        {area.zone?.code ||
                          "N/A"}
                      </td>

                      {/* STATUS */}

                      <td>

                        <button
                          onClick={() =>
                            handleToggleStatus(
                              area
                            )
                          }
                        >
                          {area.isActive
                            ? "ACTIVE"
                            : "INACTIVE"}
                        </button>

                      </td>

                      {/* ACTIONS */}

                      <td>

                        <button
                          onClick={() =>
                            handleEdit(area)
                          }
                        >
                          Edit
                        </button>

                        {" "}

                        <button
                          onClick={() =>
                            handleDelete(
                              area._id
                            )
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default Areas;