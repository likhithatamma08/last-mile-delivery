import { useEffect, useState } from "react";
import API from "../services/api";

function Zones() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ===============================
  // FETCH ZONES
  // ===============================

  const fetchZones = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/zones");

      setZones(response.data.zones || []);
    } catch (error) {
      console.error("Error fetching zones:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load zones"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  // ===============================
  // HANDLE INPUT
  // ===============================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ===============================
  // ADD ZONE
  // ===============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.name || !formData.code) {
      setError("Zone name and zone code are required");
      return;
    }

    try {
      setSaving(true);

      await API.post("/zones", {
        name: formData.name,
        code: formData.code.toUpperCase(),
        description: formData.description,
      });

      setSuccess("Zone added successfully");

      setFormData({
        name: "",
        code: "",
        description: "",
      });

      setShowForm(false);

      await fetchZones();
    } catch (error) {
      console.error("Error adding zone:", error);

      setError(
        error.response?.data?.message ||
          "Failed to add zone"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">

      {/* ===============================
          PAGE HEADER
      =============================== */}

      <div className="page-header">

        <div>
          <h1>Zones</h1>

          <p>
            Manage delivery zones and locations
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => {
            setShowForm(!showForm);
            setError("");
            setSuccess("");
          }}
        >
          {showForm ? "Cancel" : "+ Add New Zone"}
        </button>

      </div>

      {/* ===============================
          MESSAGES
      =============================== */}

      {error && (
        <div className="alert error-alert">
          {error}
        </div>
      )}

      {success && (
        <div className="alert success-alert">
          {success}
        </div>
      )}

      {/* ===============================
          ADD ZONE FORM
      =============================== */}

      {showForm && (
        <div className="form-card">

          <h2>Add New Zone</h2>

          <p className="form-description">
            Create a new delivery zone.
          </p>

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              <div className="form-group">
                <label>
                  Zone Name *
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Example: Chennai"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>
                  Zone Code *
                </label>

                <input
                  type="text"
                  name="code"
                  placeholder="Example: CHN"
                  value={formData.code}
                  onChange={handleChange}
                  maxLength={10}
                />
              </div>

            </div>

            <div className="form-group">

              <label>
                Description
              </label>

              <textarea
                name="description"
                placeholder="Enter zone description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
              />

            </div>

            <div className="form-actions">

              <button
                type="button"
                className="secondary-button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={saving}
              >
                {saving ? "Adding..." : "Add Zone"}
              </button>

            </div>

          </form>

        </div>
      )}

      {/* ===============================
          ZONES TABLE
      =============================== */}

      <div className="content-card">

        <div className="content-card-header">

          <div>
            <h2>All Zones</h2>

            <p>
              {zones.length} zone
              {zones.length !== 1 ? "s" : ""}
            </p>
          </div>

        </div>

        {loading && (
          <div className="loading-state">
            Loading zones...
          </div>
        )}

        {!loading && zones.length === 0 && (
          <div className="empty-state">

            <div className="empty-icon">
              📍
            </div>

            <h3>No zones found</h3>

            <p>
              Create your first delivery zone.
            </p>

            <button
              className="primary-button"
              onClick={() => setShowForm(true)}
            >
              + Add Zone
            </button>

          </div>
        )}

        {!loading && zones.length > 0 && (
          <div className="table-wrapper">

            <table className="data-table">

              <thead>
                <tr>
                  <th>#</th>
                  <th>Zone Name</th>
                  <th>Code</th>
                  <th>Description</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {zones.map((zone, index) => (
                  <tr key={zone._id}>

                    <td>
                      {index + 1}
                    </td>

                    <td>
                      <strong>
                        {zone.name}
                      </strong>
                    </td>

                    <td>
                      <span className="code-badge">
                        {zone.code}
                      </span>
                    </td>

                    <td>
                      {zone.description ||
                        "No description"}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${
                          zone.isActive === false
                            ? "inactive"
                            : "active"
                        }`}
                      >
                        {zone.isActive === false
                          ? "Inactive"
                          : "Active"}
                      </span>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}

export default Zones;