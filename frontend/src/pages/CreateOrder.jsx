import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function CreateOrder() {
  const navigate = useNavigate();

  const [zones, setZones] = useState([]);
  const [areas, setAreas] = useState([]);

  const [formData, setFormData] = useState({
    pickupAddress: "",
    deliveryAddress: "",
    packageDescription: "",
    packageWeight: "",
    length: "",
    width: "",
    height: "",
    orderType: "B2C",
    paymentType: "PREPAID",
    zone: "",
    area: "",
    expectedDeliveryDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingLocations, setLoadingLocations] =
    useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ============================================
  // LOAD ZONES AND AREAS
  // ============================================

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const [zonesResponse, areasResponse] =
        await Promise.all([
          API.get("/zones"),
          API.get("/areas"),
        ]);

      setZones(zonesResponse.data.zones || []);
      setAreas(areasResponse.data.areas || []);
    } catch (error) {
      console.error(
        "Error loading zones and areas:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load zones and areas"
      );
    } finally {
      setLoadingLocations(false);
    }
  };

  // ============================================
  // HANDLE INPUT
  // ============================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ============================================
  // CREATE ORDER
  // ============================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const response = await API.post(
        "/orders",
        formData
      );

      setSuccess(
        `Order ${response.data.order.orderNumber} created successfully!`
      );

      setTimeout(() => {
        navigate("/orders");
      }, 1500);

    } catch (error) {
      console.error(
        "Create order error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to create order"
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // LOADING LOCATIONS
  // ============================================

  if (loadingLocations) {
    return (
      <div className="create-order-page">
        <h1>Create New Order</h1>
        <p>Loading zones and areas...</p>
      </div>
    );
  }

  return (
    <div className="create-order-page">

      <div className="create-order-container">

        <h1>Create New Order</h1>

        <p>
          Enter the package and delivery details
        </p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* ================================= */}
          {/* DELIVERY DETAILS */}
          {/* ================================= */}

          <h3>Delivery Details</h3>

          <div className="form-group">

            <label>
              Pickup Address
            </label>

            <input
              type="text"
              name="pickupAddress"
              placeholder="Enter pickup address"
              value={formData.pickupAddress}
              onChange={handleChange}
              required
            />

          </div>

          <div className="form-group">

            <label>
              Delivery Address
            </label>

            <input
              type="text"
              name="deliveryAddress"
              placeholder="Enter delivery address"
              value={formData.deliveryAddress}
              onChange={handleChange}
              required
            />

          </div>

          {/* ================================= */}
          {/* PACKAGE DETAILS */}
          {/* ================================= */}

          <h3>Package Details</h3>

          <div className="form-group">

            <label>
              Package Description
            </label>

            <input
              type="text"
              name="packageDescription"
              placeholder="Example: Electronics package"
              value={formData.packageDescription}
              onChange={handleChange}
              required
            />

          </div>

          <div className="form-row">

            <div className="form-group">

              <label>
                Weight (kg)
              </label>

              <input
                type="number"
                step="0.01"
                min="0.01"
                name="packageWeight"
                value={formData.packageWeight}
                onChange={handleChange}
                required
              />

            </div>

            <div className="form-group">

              <label>
                Length (cm)
              </label>

              <input
                type="number"
                step="0.01"
                min="0.01"
                name="length"
                value={formData.length}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          <div className="form-row">

            <div className="form-group">

              <label>
                Width (cm)
              </label>

              <input
                type="number"
                step="0.01"
                min="0.01"
                name="width"
                value={formData.width}
                onChange={handleChange}
                required
              />

            </div>

            <div className="form-group">

              <label>
                Height (cm)
              </label>

              <input
                type="number"
                step="0.01"
                min="0.01"
                name="height"
                value={formData.height}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          {/* ================================= */}
          {/* ORDER SETTINGS */}
          {/* ================================= */}

          <h3>Order Settings</h3>

          <div className="form-group">

            <label>
              Order Type
            </label>

            <select
              name="orderType"
              value={formData.orderType}
              onChange={handleChange}
            >

              <option value="B2C">
                B2C
              </option>

              <option value="B2B">
                B2B
              </option>

            </select>

          </div>

          <div className="form-group">

            <label>
              Payment Type
            </label>

            <select
              name="paymentType"
              value={formData.paymentType}
              onChange={handleChange}
            >

              <option value="PREPAID">
                Prepaid
              </option>

              <option value="COD">
                Cash on Delivery
              </option>

            </select>

          </div>

          {/* ================================= */}
          {/* ZONE */}
          {/* ================================= */}

          <div className="form-group">

            <label>
              Zone
            </label>

            <select
              name="zone"
              value={formData.zone}
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

          </div>

          {/* ================================= */}
          {/* AREA */}
          {/* ================================= */}

          <div className="form-group">

            <label>
              Area
            </label>

            <select
              name="area"
              value={formData.area}
              onChange={handleChange}
              required
            >

              <option value="">
                Select Area
              </option>

              {areas.map((area) => (

                <option
                  key={area._id}
                  value={area._id}
                >
                  {area.name}
                  {area.pincode
                    ? ` (${area.pincode})`
                    : ""}
                </option>

              ))}

            </select>

          </div>

          {/* ================================= */}
          {/* EXPECTED DELIVERY */}
          {/* ================================= */}

          <div className="form-group">

            <label>
              Expected Delivery Date
            </label>

            <input
              type="date"
              name="expectedDeliveryDate"
              value={
                formData.expectedDeliveryDate
              }
              onChange={handleChange}
            />

          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating Order..."
              : "Create Order"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default CreateOrder;