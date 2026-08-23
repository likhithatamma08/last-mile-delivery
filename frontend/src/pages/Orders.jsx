import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function Orders() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [agents, setAgents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedAgent, setSelectedAgent] = useState({});
  const [selectedStatus, setSelectedStatus] = useState({});

  const [assigningOrder, setAssigningOrder] = useState(null);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  // =====================================================
  // STATUS LABEL
  // =====================================================

  const formatStatus = (status) => {
    if (!status) return "Unknown";

    return status
      .toLowerCase()
      .split("_")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  };

  // =====================================================
  // FETCH DATA
  // =====================================================

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const ordersResponse = await API.get("/orders");

      setOrders(ordersResponse.data.orders || []);

      if (user?.role === "admin") {
        const agentsResponse = await API.get(
          "/admin/delivery-agents"
        );

        setAgents(
          agentsResponse.data.deliveryAgents || []
        );
      } else {
        setAgents([]);
      }
    } catch (error) {
      console.error("Error loading orders:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // ASSIGN DELIVERY AGENT
  // =====================================================

  const handleAssignAgent = async (orderId) => {
    const agentId = selectedAgent[orderId];

    if (!agentId) {
      alert("Please select a delivery agent");
      return;
    }

    try {
      setAssigningOrder(orderId);

      await API.patch(
        `/orders/${orderId}/assign`,
        {
          deliveryAgent: agentId,
        }
      );

      alert("Delivery agent assigned successfully");

      setSelectedAgent((previous) => ({
        ...previous,
        [orderId]: "",
      }));

      await fetchData();
    } catch (error) {
      console.error(
        "Error assigning delivery agent:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to assign delivery agent"
      );
    } finally {
      setAssigningOrder(null);
    }
  };

  // =====================================================
  // UPDATE ORDER STATUS
  // =====================================================

  const handleUpdateStatus = async (orderId) => {
    const status = selectedStatus[orderId];

    if (!status) {
      alert("Please select a status");
      return;
    }

    try {
      setUpdatingOrder(orderId);

      await API.patch(
        `/orders/${orderId}/status`,
        {
          status,
        }
      );

      alert("Order status updated successfully");

      setSelectedStatus((previous) => ({
        ...previous,
        [orderId]: "",
      }));

      await fetchData();
    } catch (error) {
      console.error(
        "Error updating order status:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update order status"
      );
    } finally {
      setUpdatingOrder(null);
    }
  };

  // =====================================================
  // NEXT STATUSES
  // =====================================================

  const getNextStatuses = (currentStatus) => {
    const transitions = {
      PLACED: ["ASSIGNED", "CANCELLED"],
      ASSIGNED: ["PICKED_UP", "CANCELLED"],
      PICKED_UP: ["IN_TRANSIT", "CANCELLED"],
      IN_TRANSIT: ["OUT_FOR_DELIVERY", "CANCELLED"],
      OUT_FOR_DELIVERY: ["DELIVERED"],
      DELIVERED: [],
      CANCELLED: [],
    };

    return transitions[currentStatus] || [];
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-loading">
          <div className="orders-spinner"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="orders-page">
        <div className="orders-error">
          <div className="orders-error-icon">⚠️</div>

          <h2>Unable to load orders</h2>

          <p>{error}</p>

          <button
            className="orders-retry-button"
            onClick={fetchData}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="orders-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="customer-orders-header">

        <div className="customer-orders-title">
          <h1>Orders</h1>

          <p>
            {user?.role === "admin"
              ? "Manage all delivery orders"
              : user?.role === "delivery_agent"
              ? "View your assigned deliveries"
              : "View your delivery orders"}
          </p>
        </div>

        <div className="customer-orders-header-right">

          <div className="customer-orders-total">
            <span>Total Orders</span>
            <strong>{orders.length}</strong>
          </div>

          <button
            className="customer-refresh-button"
            onClick={fetchData}
          >
            ↻ Refresh
          </button>

          {user?.role === "customer" && (
            <button
              className="customer-create-order-button"
              onClick={() =>
                navigate("/create-order")
              }
            >
              + Create New Order
            </button>
          )}

        </div>

      </div>

      {/* =================================================
          NO ORDERS
      ================================================= */}

      {orders.length === 0 ? (

        <div className="orders-empty">

          <div className="orders-empty-icon">
            📦
          </div>

          <h2>No Orders Yet</h2>

          <p>
            You haven't created any delivery orders.
          </p>

          {user?.role === "customer" && (
            <button
              className="customer-create-order-button"
              onClick={() =>
                navigate("/create-order")
              }
            >
              + Create Your First Order
            </button>
          )}

        </div>

      ) : (

        /* =================================================
           ORDER CARDS / TABLE
        ================================================= */

        <div className="customer-orders-card">

          <div className="customer-orders-card-header">
            <div>
              <h2>Your Orders</h2>
              <p>
                Track and manage your delivery orders
              </p>
            </div>
          </div>

          <div className="orders-table-container">

            <table className="orders-table">

              <thead>
                <tr>

                  <th>Order</th>

                  {user?.role === "admin" && (
                    <th>Customer</th>
                  )}

                  <th>Pickup</th>

                  <th>Delivery</th>

                  <th>Zone</th>

                  <th>Area</th>

                  <th>Agent</th>

                  <th>Fee</th>

                  <th>Status</th>

                  {user?.role === "admin" && (
                    <th>Action</th>
                  )}

                </tr>
              </thead>

              <tbody>

                {orders.map((order) => {

                  const nextStatuses =
                    getNextStatuses(
                      order.status
                    );

                  return (
                    <tr key={order._id}>

                      {/* ORDER */}

                      <td>

                        <button
                          className="customer-order-number"
                          onClick={() =>
                            navigate(
                              `/orders/${order._id}`
                            )
                          }
                        >
                          {order.orderNumber}
                        </button>

                        <span className="order-date">
                          {order.createdAt
                            ? new Date(
                                order.createdAt
                              ).toLocaleDateString()
                            : ""}
                        </span>

                      </td>

                      {/* CUSTOMER */}

                      {user?.role === "admin" && (
                        <td>
                          <div className="table-person">
                            <div className="table-avatar">
                              {order.customer?.name
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "U"}
                            </div>

                            <span>
                              {order.customer?.name ||
                                "N/A"}
                            </span>
                          </div>
                        </td>
                      )}

                      {/* PICKUP */}

                      <td>
                        <div className="address-cell">
                          <span className="address-icon">
                            📍
                          </span>

                          <span>
                            {order.pickupAddress ||
                              "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* DELIVERY */}

                      <td>
                        <div className="address-cell">
                          <span className="address-icon">
                            🏠
                          </span>

                          <span>
                            {order.deliveryAddress ||
                              "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* ZONE */}

                      <td>
                        {order.zone ? (
                          <div className="zone-cell">

                            <strong>
                              {order.zone.name ||
                                "N/A"}
                            </strong>

                            {order.zone.code && (
                              <small>
                                {order.zone.code}
                              </small>
                            )}

                          </div>
                        ) : (
                          <span className="muted-text">
                            N/A
                          </span>
                        )}
                      </td>

                      {/* AREA */}

                      <td>
                        {order.area ? (
                          <div className="zone-cell">

                            <strong>
                              {order.area.name ||
                                "N/A"}
                            </strong>

                            {order.area.pincode && (
                              <small>
                                {order.area.pincode}
                              </small>
                            )}

                          </div>
                        ) : (
                          <span className="muted-text">
                            N/A
                          </span>
                        )}
                      </td>

                      {/* AGENT */}

                      <td>

                        {order.deliveryAgent?.name ? (

                          <div className="table-person">

                            <div className="table-avatar agent-avatar">
                              {order.deliveryAgent.name
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div className="agent-table-info">

                              <strong>
                                {
                                  order
                                    .deliveryAgent
                                    .name
                                }
                              </strong>

                              {order.deliveryAgent.phone && (
                                <small>
                                  {
                                    order
                                      .deliveryAgent
                                      .phone
                                  }
                                </small>
                              )}

                            </div>

                          </div>

                        ) : (

                          <span className="not-assigned">
                            Not assigned
                          </span>

                        )}

                      </td>

                      {/* FEE */}

                      <td>

                        <span className="order-fee">
                          ₹
                          {Number(
                            order.deliveryFee || 0
                          ).toFixed(2)}
                        </span>

                      </td>

                      {/* STATUS */}

                      <td>

                        <span
                          className={`status ${order.status?.toLowerCase()}`}
                        >
                          <span className="status-dot"></span>

                          {formatStatus(
                            order.status
                          )}
                        </span>

                      </td>

                      {/* ADMIN ACTIONS */}

                      {user?.role === "admin" && (

                        <td>

                          {order.status ===
                            "PLACED" &&
                            !order.deliveryAgent && (

                              <div className="action-container">

                                <select
                                  value={
                                    selectedAgent[
                                      order._id
                                    ] || ""
                                  }
                                  onChange={(e) =>
                                    setSelectedAgent(
                                      (previous) => ({
                                        ...previous,
                                        [order._id]:
                                          e.target.value,
                                      })
                                    )
                                  }
                                >

                                  <option value="">
                                    Select Agent
                                  </option>

                                  {agents.map(
                                    (agent) => (
                                      <option
                                        key={
                                          agent._id
                                        }
                                        value={
                                          agent._id
                                        }
                                      >
                                        {agent.name}
                                      </option>
                                    )
                                  )}

                                </select>

                                <button
                                  onClick={() =>
                                    handleAssignAgent(
                                      order._id
                                    )
                                  }
                                  disabled={
                                    assigningOrder ===
                                    order._id
                                  }
                                >
                                  {assigningOrder ===
                                  order._id
                                    ? "Assigning..."
                                    : "Assign"}
                                </button>

                              </div>

                            )}

                          {nextStatuses.length > 0 && (

                            <div className="action-container">

                              <select
                                value={
                                  selectedStatus[
                                    order._id
                                  ] || ""
                                }
                                onChange={(e) =>
                                  setSelectedStatus(
                                    (previous) => ({
                                      ...previous,
                                      [order._id]:
                                        e.target.value,
                                    })
                                  )
                                }
                              >

                                <option value="">
                                  Update Status
                                </option>

                                {nextStatuses.map(
                                  (status) => (
                                    <option
                                      key={status}
                                      value={status}
                                    >
                                      {formatStatus(
                                        status
                                      )}
                                    </option>
                                  )
                                )}

                              </select>

                              <button
                                onClick={() =>
                                  handleUpdateStatus(
                                    order._id
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
                                  : "Update"}
                              </button>

                            </div>

                          )}

                          {(order.status ===
                            "DELIVERED" ||
                            order.status ===
                              "CANCELLED") && (
                            <span className="completed-label">
                              ✓ Completed
                            </span>
                          )}

                        </td>

                      )}

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </div>
  );
}

export default Orders;