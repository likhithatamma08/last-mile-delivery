import { useEffect, useState } from "react";
import API from "../services/api";

function RateCards() {
  const [rateCards, setRateCards] = useState([]);
  const [zones, setZones] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    zone: "",
    orderType: "B2C",
    baseRate: "",
    perKgRate: "",
    codCharge: "",
  });

  // =====================================================
  // FETCH DATA
  // =====================================================

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [rateCardsResponse, zonesResponse] =
        await Promise.all([
          API.get("/rate-cards"),
          API.get("/zones"),
        ]);

      setRateCards(
        rateCardsResponse.data.rateCards || []
      );

      setZones(
        zonesResponse.data.zones || []
      );
    } catch (error) {
      console.error("Error loading rate cards:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load rate cards"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FORM CHANGE
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
      zone: "",
      orderType: "B2C",
      baseRate: "",
      perKgRate: "",
      codCharge: "",
    });

    setEditingId(null);
    setShowForm(false);
  };

  // =====================================================
  // CREATE / UPDATE
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      if (!form.zone) {
        setError("Please select a zone");
        return;
      }

      if (
        form.baseRate === "" ||
        form.perKgRate === ""
      ) {
        setError(
          "Base rate and per KG rate are required"
        );
        return;
      }

      const data = {
        zone: form.zone,
        orderType: form.orderType,
        baseRate: Number(form.baseRate),
        perKgRate: Number(form.perKgRate),
        codCharge: Number(form.codCharge || 0),
      };

      if (editingId) {
        await API.put(
          `/rate-cards/${editingId}`,
          data
        );
      } else {
        await API.post(
          "/rate-cards",
          data
        );
      }

      resetForm();

      await fetchData();
    } catch (error) {
      console.error(
        "Error saving rate card:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to save rate card"
      );
    }
  };

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (rateCard) => {
    setEditingId(rateCard._id);

    setForm({
      zone:
        rateCard.zone?._id ||
        rateCard.zone ||
        "",
      orderType: rateCard.orderType || "B2C",
      baseRate: rateCard.baseRate ?? "",
      perKgRate: rateCard.perKgRate ?? "",
      codCharge: rateCard.codCharge ?? "",
    });

    setShowForm(true);
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this rate card?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await API.delete(
        `/rate-cards/${id}`
      );

      await fetchData();
    } catch (error) {
      console.error(
        "Error deleting rate card:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete rate card"
      );
    }
  };

  // =====================================================
  // TOGGLE ACTIVE
  // =====================================================

  const handleToggleStatus = async (rateCard) => {
    try {
      setError("");

      await API.put(
        `/rate-cards/${rateCard._id}`,
        {
          isActive: !rateCard.isActive,
        }
      );

      await fetchData();
    } catch (error) {
      console.error(
        "Error updating rate card status:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update rate card"
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="details-card">
        <h1>Rate Cards</h1>
        <p>Loading rate cards...</p>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="users-page">

      <div className="users-page-header">

        <div>
          <h1>Rate Cards</h1>

          <p>
            Manage delivery pricing by zone
            and order type
          </p>
        </div>

        <strong>
          Total Rate Cards: {rateCards.length}
        </strong>

      </div>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {/* ================================================= */}
      {/* ADD BUTTON */}
      {/* ================================================= */}

      <div className="quick-actions">

        <button
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
        >
          {showForm
            ? "Cancel"
            : "+ Add Rate Card"}
        </button>

      </div>

      {/* ================================================= */}
      {/* FORM */}
      {/* ================================================= */}

      {showForm && (
        <div className="details-card">

          <h2>
            {editingId
              ? "Edit Rate Card"
              : "Create Rate Card"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="order-form"
          >

            <div className="form-group">

              <label>
                Zone
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
                    {zone.name}{" "}
                    {zone.code
                      ? `(${zone.code})`
                      : ""}
                  </option>
                ))}

              </select>

            </div>

            <div className="form-group">

              <label>
                Order Type
              </label>

              <select
                name="orderType"
                value={form.orderType}
                onChange={handleChange}
              >

                <option value="B2B">
                  B2B
                </option>

                <option value="B2C">
                  B2C
                </option>

              </select>

            </div>

            <div className="form-group">

              <label>
                Base Rate
              </label>

              <input
                type="number"
                name="baseRate"
                value={form.baseRate}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />

            </div>

            <div className="form-group">

              <label>
                Per KG Rate
              </label>

              <input
                type="number"
                name="perKgRate"
                value={form.perKgRate}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />

            </div>

            <div className="form-group">

              <label>
                COD Charge
              </label>

              <input
                type="number"
                name="codCharge"
                value={form.codCharge}
                onChange={handleChange}
                min="0"
                step="0.01"
              />

            </div>

            <button type="submit">
              {editingId
                ? "Update Rate Card"
                : "Create Rate Card"}
            </button>

          </form>

        </div>
      )}

      {/* ================================================= */}
      {/* TABLE */}
      {/* ================================================= */}

      <div className="details-card">

        <h2>
          Rate Cards
        </h2>

        {rateCards.length === 0 ? (

          <p>
            No rate cards found.
          </p>

        ) : (

          <div className="users-table-container">

            <table className="users-table">

              <thead>

                <tr>
                  <th>Zone</th>
                  <th>Zone Code</th>
                  <th>Order Type</th>
                  <th>Base Rate</th>
                  <th>Per KG Rate</th>
                  <th>COD Charge</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>

                {rateCards.map((rateCard) => (

                  <tr key={rateCard._id}>

                    <td>
                      {rateCard.zone?.name ||
                        "N/A"}
                    </td>

                    <td>
                      {rateCard.zone?.code ||
                        "N/A"}
                    </td>

                    <td>
                      {rateCard.orderType}
                    </td>

                    <td>
                      ₹
                      {Number(
                        rateCard.baseRate
                      ).toFixed(2)}
                    </td>

                    <td>
                      ₹
                      {Number(
                        rateCard.perKgRate
                      ).toFixed(2)}
                    </td>

                    <td>
                      ₹
                      {Number(
                        rateCard.codCharge || 0
                      ).toFixed(2)}
                    </td>

                    <td>

                      <button
                        onClick={() =>
                          handleToggleStatus(
                            rateCard
                          )
                        }
                      >
                        {rateCard.isActive
                          ? "ACTIVE"
                          : "INACTIVE"}
                      </button>

                    </td>

                    <td>

                      <button
                        onClick={() =>
                          handleEdit(rateCard)
                        }
                      >
                        Edit
                      </button>

                      {" "}

                      <button
                        onClick={() =>
                          handleDelete(
                            rateCard._id
                          )
                        }
                      >
                        Delete
                      </button>

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

export default RateCards;