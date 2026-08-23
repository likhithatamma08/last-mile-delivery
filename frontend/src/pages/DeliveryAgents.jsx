import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

function DeliveryAgents() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.role !== "admin") {
      setLoading(false);
      return;
    }

    fetchAgents();
  }, [user]);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/admin/delivery-agents");

      setAgents(response.data.deliveryAgents || []);
    } catch (error) {
      console.error("Error fetching delivery agents:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load delivery agents"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="delivery-agents-page">
        <div className="agents-message-card">
          <h2>Delivery Agents</h2>
          <p>Please login to continue.</p>

          <button
            className="primary-button"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="delivery-agents-page">
        <div className="agents-message-card">
          <h2>Delivery Agents</h2>

          <p className="error-message">
            Access denied. Only administrators can view
            delivery agents.
          </p>

          <button
            className="primary-button"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="delivery-agents-page">
        <div className="agents-loading">
          <div className="loading-spinner"></div>
          <p>Loading delivery agents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="delivery-agents-page">
        <div className="agents-error">
          <div className="agents-error-icon">⚠️</div>

          <h3>Unable to load delivery agents</h3>

          <p>{error}</p>

          <button
            className="primary-button"
            onClick={fetchAgents}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const totalOrders = agents.reduce(
    (sum, agent) =>
      sum + (agent.totalOrders || 0),
    0
  );

  const activeOrders = agents.reduce(
    (sum, agent) =>
      sum + (agent.activeOrders || 0),
    0
  );

  const deliveredOrders = agents.reduce(
    (sum, agent) =>
      sum + (agent.deliveredOrders || 0),
    0
  );

  return (
    <div className="delivery-agents-page">

      {/* HEADER */}

      <div className="agents-page-header">

        <div>
          <h1>Delivery Agents</h1>

          <p>
            Manage delivery agents and their deliveries
          </p>
        </div>

        <button
          className="refresh-agents-btn"
          onClick={fetchAgents}
        >
          ↻ Refresh
        </button>

      </div>

      {/* SUMMARY */}

      <div className="agents-summary">

        <div className="agent-summary-card">

          <div className="agent-summary-icon agents-total-icon">
            👥
          </div>

          <div>
            <p>Total Agents</p>
            <h2>{agents.length}</h2>
          </div>

        </div>

        <div className="agent-summary-card">

          <div className="agent-summary-icon agents-orders-icon">
            📦
          </div>

          <div>
            <p>Total Orders</p>
            <h2>{totalOrders}</h2>
          </div>

        </div>

        <div className="agent-summary-card">

          <div className="agent-summary-icon agents-active-icon">
            🚚
          </div>

          <div>
            <p>Active Deliveries</p>
            <h2>{activeOrders}</h2>
          </div>

        </div>

        <div className="agent-summary-card">

          <div className="agent-summary-icon agents-delivered-icon">
            ✓
          </div>

          <div>
            <p>Delivered</p>
            <h2>{deliveredOrders}</h2>
          </div>

        </div>

      </div>

      {/* AGENTS TABLE */}

      <div className="agents-card">

        <div className="agents-card-header">

          <div>
            <h2>All Delivery Agents</h2>

            <p>
              View agent performance and delivery activity
            </p>
          </div>

          <span className="agent-count-badge">
            {agents.length} Agents
          </span>

        </div>

        {agents.length === 0 ? (

          <div className="agents-empty">

            <div className="agents-empty-icon">
              🚚
            </div>

            <h3>No delivery agents found</h3>

            <p>
              There are currently no registered delivery
              agents.
            </p>

          </div>

        ) : (

          <div className="agents-table-wrapper">

            <table className="agents-table">

              <thead>
                <tr>

                  <th>Agent</th>

                  <th>Contact</th>

                  <th>Total Orders</th>

                  <th>Active</th>

                  <th>Delivered</th>

                  <th>Performance</th>

                </tr>
              </thead>

              <tbody>

                {agents.map((agent) => {

                  const total =
                    agent.totalOrders || 0;

                  const delivered =
                    agent.deliveredOrders || 0;

                  const active =
                    agent.activeOrders || 0;

                  const percentage =
                    total > 0
                      ? Math.round(
                          (delivered / total) * 100
                        )
                      : 0;

                  return (
                    <tr key={agent._id}>

                      {/* AGENT */}

                      <td>

                        <div className="agent-profile">

                          <div className="agent-avatar">
                            {agent.name
                              ?.charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="agent-info">

                            <strong>
                              {agent.name}
                            </strong>

                            <span>
                              DELIVERY AGENT
                            </span>

                          </div>

                        </div>

                      </td>

                      {/* CONTACT */}

                      <td>

                        <div className="agent-contact">

                          <span>
                            ✉ {agent.email}
                          </span>

                          <span>
                            ☎ {agent.phone || "N/A"}
                          </span>

                        </div>

                      </td>

                      {/* TOTAL */}

                      <td>

                        <span className="agent-number">
                          {total}
                        </span>

                      </td>

                      {/* ACTIVE */}

                      <td>

                        <span className="active-orders">
                          {active}
                        </span>

                      </td>

                      {/* DELIVERED */}

                      <td>

                        <span className="delivered-orders">
                          {delivered}
                        </span>

                      </td>

                      {/* PERFORMANCE */}

                      <td>

                        <div className="performance">

                          <div className="performance-top">

                            <span>
                              {percentage}%
                            </span>

                          </div>

                          <div className="performance-bar">

                            <div
                              className="performance-fill"
                              style={{
                                width: `${percentage}%`,
                              }}
                            ></div>

                          </div>

                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default DeliveryAgents;