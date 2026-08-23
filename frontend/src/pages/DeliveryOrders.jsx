import { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function DeliveryOrders() {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrder, setUpdatingOrder] = useState(null);

  // ============================================
  // FETCH ASSIGNED ORDERS
  // ============================================

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/orders");

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Error loading delivery orders:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load delivery orders"
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // GET NEXT AVAILABLE STATUSES
  // ============================================

  const getNextStatuses = (currentStatus) => {
    const transitions = {
      ASSIGNED: ["PICKED_UP"],
      PICKED_UP: ["IN_TRANSIT"],
      IN_TRANSIT: ["OUT_FOR_DELIVERY"],
      OUT_FOR_DELIVERY: ["DELIVERED"],
      DELIVERED: [],
      CANCELLED: [],
    };

    return transitions[currentStatus] || [];
  };

  // ============================================
  // UPDATE ORDER STATUS
  // ============================================

  const handleUpdateStatus = async (orderId, status) => {
    try {
      setUpdatingOrder(orderId);

      await API.patch(`/orders/${orderId}/status`, {
        status,
      });

      alert(`Order status updated to ${status}`);

      await fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update order status"
      );
    } finally {
      setUpdatingOrder(null);
    }
  };

  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <div className="delivery-orders-page">
        <h1>My Deliveries</h1>
        <p>Loading orders...</p>
      </div>
    );
  }

  // ============================================
  // ERROR
  // ============================================

  if (error) {
    return (
      <div className="delivery-orders-page">
        <h1>My Deliveries</h1>

        <p className="error-message">
          {error}
        </p>
      </div>
    );
  }

  // ============================================
  // UI
  // ============================================

  return (
    <div className="delivery-orders-page">

      <div className="page-header">
        <div>
          <h1>My Deliveries</h1>

          <p>
            Welcome, {user?.name}
          </p>
        </div>

        <strong>
          Total Assigned: {orders.length}
        </strong>
      </div>

      {orders.length === 0 ? (
        <div className="empty-message">
          <h2>No deliveries assigned</h2>

          <p>
            You currently have no delivery orders assigned to you.
          </p>
        </div>
      ) : (
        <div className="orders-table-container">

          <table className="orders-table">

            <thead>
              <tr>
                <th>Order Number</th>
                <th>Customer</th>
                <th>Pickup</th>
                <th>Delivery</th>
                <th>Package</th>
                <th>Fee</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {orders.map((order) => {

                const nextStatuses =
                  getNextStatuses(order.status);

                return (
                  <tr key={order._id}>

                    {/* ORDER NUMBER */}
                    <td>
                      <strong>
                        {order.orderNumber}
                      </strong>
                    </td>

                    {/* CUSTOMER */}
                    <td>
                      {order.customer?.name ||
                        "N/A"}

                      <br />

                      <small>
                        {order.customer?.phone ||
                          ""}
                      </small>
                    </td>

                    {/* PICKUP */}
                    <td>
                      {order.pickupAddress}
                    </td>

                    {/* DELIVERY */}
                    <td>
                      {order.deliveryAddress}
                    </td>

                    {/* PACKAGE */}
                    <td>
                      {order.packageDescription}

                      <br />

                      <small>
                        Weight:{" "}
                        {order.packageWeight} kg
                      </small>
                    </td>

                    {/* FEE */}
                    <td>
                      ₹
                      {Number(
                        order.deliveryFee || 0
                      ).toFixed(2)}
                    </td>

                    {/* STATUS */}
                    <td>
                      <span
                        className={`status ${order.status?.toLowerCase()}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    {/* ACTION */}
                    <td>

                      {nextStatuses.length > 0 ? (

                        <div className="action-container">

                          {nextStatuses.map(
                            (status) => (
                              <button
                                key={status}
                                onClick={() =>
                                  handleUpdateStatus(
                                    order._id,
                                    status
                                  )
                                }
                                disabled={
                                  updatingOrder ===
                                  order._id
                                }
                              >
                                {updatingOrder ===
                                order._id
                                  ? "Updating..."
                                  : status.replace(
                                      /_/g,
                                      " "
                                    )}
                              </button>
                            )
                          )}

                        </div>

                      ) : (
                        <span>—</span>
                      )}

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}

export default DeliveryOrders;