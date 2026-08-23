import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import NotificationBell from "../components/NotificationBell";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState("");

  const role = user?.role;

  const isAdmin = role === "admin";
  const isCustomer = role === "customer";
  const isDeliveryAgent = role === "delivery_agent";

  useEffect(() => {
    if (!user) return;
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      setError("");

      const response = await API.get("/orders");

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setLoadingOrders(false);
    }
  };

  // =====================================================
  // ORDER STATUS
  // =====================================================

  const getStatus = (order) =>
    String(order.status || "").toLowerCase();

  // =====================================================
  // DASHBOARD CALCULATIONS
  // =====================================================

  const totalOrders = orders.length;

  const activeDeliveries = orders.filter((order) =>
    [
      "assigned",
      "picked_up",
      "in_transit",
      "out_for_delivery",
    ].includes(getStatus(order))
  ).length;

  const deliveredOrders = orders.filter(
    (order) => getStatus(order) === "delivered"
  ).length;

  const totalRevenue = orders.reduce(
    (total, order) =>
      total + Number(order.deliveryFee || 0),
    0
  );

  // =====================================================
  // NAVIGATION
  // =====================================================

  const goTo = (path) => {
    navigate(path);
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="dashboard-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="dashboard-header">

        <div>
          <h1>Last Mile</h1>
          <p>Delivery Management System</p>
        </div>

        <div className="header-right">

          <NotificationBell />

          <span>
            {user?.name || "User"}
          </span>

          <button onClick={handleLogout}>
            Logout
          </button>

        </div>

      </header>

      {/* =================================================
          DASHBOARD LAYOUT
      ================================================= */}

      <div className="dashboard-layout">

        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside className="sidebar">

          <h2>
            {isAdmin
              ? "Admin Panel"
              : isDeliveryAgent
              ? "Agent Panel"
              : "Customer Panel"}
          </h2>

          <nav>

            {/* DASHBOARD */}

            <button
              onClick={() => goTo("/dashboard")}
            >
              Dashboard
            </button>

            {/* =================================================
                ADMIN MENU
            ================================================= */}

            {isAdmin && (
              <>

                <button
                  onClick={() => goTo("/orders")}
                >
                  Orders
                </button>

                <button
                  onClick={() => goTo("/users")}
                >
                  Users
                </button>

                <button
                  onClick={() =>
                    goTo("/delivery-agents")
                  }
                >
                  Delivery Agents
                </button>

                {/* ZONES */}

                <button
                  onClick={() => goTo("/zones")}
                >
                  Zones
                </button>

                {/* AREAS */}

                <button
                  onClick={() => goTo("/areas")}
                >
                  Areas
                </button>

                {/* RATE CARDS */}

                <button
                  onClick={() =>
                    goTo("/rate-cards")
                  }
                >
                  Rate Cards
                </button>

                {/* NOTIFICATIONS */}

                <button
                  onClick={() =>
                    goTo("/notifications")
                  }
                >
                  Notifications
                </button>

              </>
            )}

            {/* =================================================
                CUSTOMER MENU
            ================================================= */}

            {isCustomer && (
              <>

                <button
                  onClick={() => goTo("/orders")}
                >
                  My Orders
                </button>

                <button
                  onClick={() =>
                    goTo("/create-order")
                  }
                >
                  Create New Order
                </button>

                <button
                  onClick={() =>
                    goTo("/notifications")
                  }
                >
                  Notifications
                </button>

              </>
            )}

            {/* =================================================
                DELIVERY AGENT MENU
            ================================================= */}

            {isDeliveryAgent && (
              <>

                <button
                  onClick={() =>
                    goTo("/my-deliveries")
                  }
                >
                  My Deliveries
                </button>

                <button
                  onClick={() =>
                    goTo("/notifications")
                  }
                >
                  Notifications
                </button>

              </>
            )}

          </nav>

        </aside>

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <main className="dashboard-content">

          {/* =================================================
              WELCOME
          ================================================= */}

          <div className="welcome-section">

            <h2>
              Welcome, {user?.name || "User"}
            </h2>

            <p>
              Role:{" "}
              <strong>
                {user?.role || "N/A"}
              </strong>
            </p>

          </div>

          {/* =================================================
              STATISTICS
          ================================================= */}

          <div className="stats-grid">

            <div className="stat-card">

              <h3>
                Total Orders
              </h3>

              <p>
                {totalOrders}
              </p>

            </div>

            <div className="stat-card">

              <h3>
                Active Deliveries
              </h3>

              <p>
                {activeDeliveries}
              </p>

            </div>

            <div className="stat-card">

              <h3>
                Delivered Orders
              </h3>

              <p>
                {deliveredOrders}
              </p>

            </div>

            <div className="stat-card">

              <h3>
                Total Revenue
              </h3>

              <p>
                ₹{totalRevenue.toFixed(2)}
              </p>

            </div>

          </div>

          {/* =================================================
              QUICK ACTIONS
          ================================================= */}

          <section className="orders-section">

            <h2>
              Quick Actions
            </h2>

            <div className="quick-actions">

              {/* ADMIN QUICK ACTIONS */}

              {isAdmin && (
                <>

                  <button
                    onClick={() =>
                      goTo("/orders")
                    }
                  >
                    Manage Orders
                  </button>

                  <button
                    onClick={() =>
                      goTo("/users")
                    }
                  >
                    Manage Users
                  </button>

                  <button
                    onClick={() =>
                      goTo("/delivery-agents")
                    }
                  >
                    Delivery Agents
                  </button>

                  <button
                    onClick={() =>
                      goTo("/zones")
                    }
                  >
                    Manage Zones
                  </button>

                  {/* MANAGE AREAS */}

                  <button
                    onClick={() =>
                      goTo("/areas")
                    }
                  >
                    Manage Areas
                  </button>

                  <button
                    onClick={() =>
                      goTo("/rate-cards")
                    }
                  >
                    Manage Rate Cards
                  </button>

                </>
              )}

              {/* CUSTOMER QUICK ACTIONS */}

              {isCustomer && (
                <>

                  <button
                    onClick={() =>
                      goTo("/create-order")
                    }
                  >
                    + Create New Order
                  </button>

                  <button
                    onClick={() =>
                      goTo("/orders")
                    }
                  >
                    View My Orders
                  </button>

                </>
              )}

              {/* DELIVERY AGENT QUICK ACTION */}

              {isDeliveryAgent && (
                <button
                  onClick={() =>
                    goTo("/my-deliveries")
                  }
                >
                  View My Deliveries
                </button>
              )}

              {/* NOTIFICATIONS */}

              <button
                onClick={() =>
                  goTo("/notifications")
                }
              >
                Notifications
              </button>

            </div>

          </section>

          {/* =================================================
              RECENT ORDERS
          ================================================= */}

          <section className="orders-section">

            <h2>
              Recent Orders
            </h2>

            {/* LOADING */}

            {loadingOrders && (
              <p>
                Loading orders...
              </p>
            )}

            {/* ERROR */}

            {error && (
              <p className="error-message">
                {error}
              </p>
            )}

            {/* EMPTY */}

            {!loadingOrders &&
              !error &&
              orders.length === 0 && (
                <div className="empty-orders">

                  <p>
                    No orders found.
                  </p>

                </div>
              )}

            {/* ORDERS TABLE */}

            {!loadingOrders &&
              !error &&
              orders.length > 0 && (

                <div className="orders-table-container">

                  <table className="orders-table">

                    <thead>

                      <tr>

                        <th>
                          Order Number
                        </th>

                        <th>
                          Customer
                        </th>

                        <th>
                          Agent
                        </th>

                        <th>
                          Fee
                        </th>

                        <th>
                          Status
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {orders
                        .slice(0, 10)
                        .map((order) => (

                          <tr
                            key={order._id}
                          >

                            {/* ORDER NUMBER */}

                            <td>

                              <button
                                className="order-link"
                                onClick={() =>
                                  goTo(
                                    `/orders/${order._id}`
                                  )
                                }
                              >
                                {order.orderNumber}
                              </button>

                            </td>

                            {/* CUSTOMER */}

                            <td>

                              {order.customer?.name ||
                                "N/A"}

                            </td>

                            {/* DELIVERY AGENT */}

                            <td>

                              {order.deliveryAgent?.name ||
                                "Not assigned"}

                            </td>

                            {/* DELIVERY FEE */}

                            <td>

                              ₹
                              {Number(
                                order.deliveryFee || 0
                              ).toFixed(2)}

                            </td>

                            {/* STATUS */}

                            <td>

                              <span
                                className={`status ${getStatus(
                                  order
                                )}`}
                              >
                                {String(
                                  order.status || ""
                                ).replaceAll(
                                  "_",
                                  " "
                                )}
                              </span>

                            </td>

                          </tr>

                        ))}

                    </tbody>

                  </table>

                </div>

              )}

          </section>

        </main>

      </div>

    </div>
  );
}

export default Dashboard;