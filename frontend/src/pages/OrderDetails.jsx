
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH ORDER + TRACKING
  // =====================================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [orderResponse, trackingResponse] =
          await Promise.all([
            api.get(`/orders/${id}`),
            api.get(`/orders/${id}/tracking`),
          ]);

        setOrder(orderResponse.data.order);
        setTracking(trackingResponse.data.history || []);
      } catch (err) {
        console.error("Order details error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load order details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">
          Loading order details...
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="page-container">
        <div className="error-message">
          {error}
        </div>

        <button onClick={() => navigate("/orders")}>
          Back to Orders
        </button>
      </div>
    );
  }

  // =====================================================
  // ORDER NOT FOUND
  // =====================================================

  if (!order) {
    return (
      <div className="page-container">
        <h2>Order not found</h2>

        <button onClick={() => navigate("/orders")}>
          Back to Orders
        </button>
      </div>
    );
  }

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // =====================================================
  // STATUS LABEL
  // =====================================================

  const formatStatus = (status) => {
    if (!status) return "";

    return status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    switch (status) {
      case "DELIVERED":
        return "status-delivered";

      case "OUT_FOR_DELIVERY":
        return "status-out";

      case "IN_TRANSIT":
        return "status-transit";

      case "PICKED_UP":
        return "status-picked";

      case "ASSIGNED":
        return "status-assigned";

      case "CANCELLED":
        return "status-cancelled";

      default:
        return "status-placed";
    }
  };

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="page-container">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="page-header">

        <div>
          <button
            className="back-button"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <h1>Order Details</h1>

          <p>
            Order #{order.orderNumber}
          </p>
        </div>

        <div
          className={`order-status ${getStatusClass(
            order.status
          )}`}
        >
          {formatStatus(order.status)}
        </div>

      </div>

      {/* =================================================
          ORDER INFORMATION
      ================================================= */}

      <div className="details-grid">

        <div className="details-card">

          <h2>Order Information</h2>

          <div className="detail-row">
            <span>Order Number</span>
            <strong>
              {order.orderNumber}
            </strong>
          </div>

          <div className="detail-row">
            <span>Order Type</span>
            <strong>
              {order.orderType}
            </strong>
          </div>

          <div className="detail-row">
            <span>Payment Type</span>
            <strong>
              {order.paymentType}
            </strong>
          </div>

          <div className="detail-row">
            <span>Order Status</span>
            <strong>
              {formatStatus(order.status)}
            </strong>
          </div>

          <div className="detail-row">
            <span>Delivery Fee</span>
            <strong>
              ₹{order.deliveryFee}
            </strong>
          </div>

          <div className="detail-row">
            <span>Created At</span>
            <strong>
              {formatDate(order.createdAt)}
            </strong>
          </div>

          {order.expectedDeliveryDate && (
            <div className="detail-row">
              <span>Expected Delivery</span>
              <strong>
                {formatDate(
                  order.expectedDeliveryDate
                )}
              </strong>
            </div>
          )}

          {order.deliveredAt && (
            <div className="detail-row">
              <span>Delivered At</span>
              <strong>
                {formatDate(order.deliveredAt)}
              </strong>
            </div>
          )}

        </div>

        {/* =================================================
            PACKAGE
        ================================================= */}

        <div className="details-card">

          <h2>Package Details</h2>

          <div className="detail-row">
            <span>Description</span>
            <strong>
              {order.packageDescription}
            </strong>
          </div>

          <div className="detail-row">
            <span>Actual Weight</span>
            <strong>
              {order.packageWeight} kg
            </strong>
          </div>

          <div className="detail-row">
            <span>Volumetric Weight</span>
            <strong>
              {order.volumetricWeight?.toFixed(2)} kg
            </strong>
          </div>

          <div className="detail-row">
            <span>Billable Weight</span>
            <strong>
              {order.billableWeight?.toFixed(2)} kg
            </strong>
          </div>

          <div className="detail-row">
            <span>Dimensions</span>
            <strong>
              {order.length} × {order.width} ×{" "}
              {order.height} cm
            </strong>
          </div>

        </div>

      </div>

      {/* =================================================
          ADDRESSES
      ================================================= */}

      <div className="details-card">

        <h2>Delivery Information</h2>

        <div className="address-grid">

          <div>
            <span className="address-label">
              Pickup Address
            </span>

            <p>
              {order.pickupAddress}
            </p>
          </div>

          <div>
            <span className="address-label">
              Delivery Address
            </span>

            <p>
              {order.deliveryAddress}
            </p>
          </div>

        </div>

      </div>

      {/* =================================================
          DELIVERY AGENT
      ================================================= */}

      {order.deliveryAgent && (
        <div className="details-card">

          <h2>Delivery Agent</h2>

          <div className="agent-details">

            <div>
              <span>Name</span>
              <strong>
                {order.deliveryAgent.name}
              </strong>
            </div>

            <div>
              <span>Email</span>
              <strong>
                {order.deliveryAgent.email}
              </strong>
            </div>

            {order.deliveryAgent.phone && (
              <div>
                <span>Phone</span>
                <strong>
                  {order.deliveryAgent.phone}
                </strong>
              </div>
            )}

          </div>

        </div>
      )}

      {/* =================================================
          TRACKING TIMELINE
      ================================================= */}

      <div className="details-card tracking-card">

        <h2>Order Tracking</h2>

        {tracking.length === 0 ? (
          <p className="empty-message">
            No tracking history available.
          </p>
        ) : (
          <div className="tracking-timeline">

            {tracking.map((item, index) => (

              <div
                className="tracking-item"
                key={item._id}
              >

                <div className="tracking-line">

                  <div className="tracking-dot">
                    ✓
                  </div>

                  {index !== tracking.length - 1 && (
                    <div className="tracking-connector" />
                  )}

                </div>

                <div className="tracking-content">

                  <div className="tracking-header">

                    <h3>
                      {formatStatus(item.status)}
                    </h3>

                    <span>
                      {formatDate(item.createdAt)}
                    </span>

                  </div>

                  {item.notes && (
                    <p>
                      {item.notes}
                    </p>
                  )}

                  {item.location && (
                    <p>
                      📍 {item.location}
                    </p>
                  )}

                  {item.updatedBy && (
                    <small>
                      Updated by:{" "}
                      {item.updatedBy.name}
                    </small>
                  )}

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default OrderDetails;

