
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

function Users() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [agents, setAgents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.role !== "admin") {
      setLoading(false);
      return;
    }

    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        customersResponse,
        agentsResponse,
      ] = await Promise.all([
        API.get("/admin/customers"),
        API.get("/admin/delivery-agents"),
      ]);

      setCustomers(
        customersResponse.data.customers || []
      );

      setAgents(
        agentsResponse.data.deliveryAgents || []
      );
    } catch (error) {
      console.error("Error fetching users:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  if (!user) {
    return (
      <div className="users-page">
        <div className="users-simple-card">
          <h1>Users</h1>
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
      <div className="users-page">
        <div className="users-simple-card">
          <h1>Users</h1>

          <p className="error-message">
            Access denied. Only administrators can
            view users.
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
      <div className="users-page">
        <div className="users-loading">
          <div className="loading-spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="users-page">
        <div className="users-page-header">
          <div>
            <h1>Users</h1>
            <p>
              Manage customers and delivery agents
            </p>
          </div>
        </div>

        <div className="users-error">
          <div className="users-error-icon">
            ⚠
          </div>

          <h3>Unable to load users</h3>

          <p>{error}</p>

          <button onClick={fetchUsers}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="users-page">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="users-page-header">

        <div>
          <h1>Users</h1>

          <p>
            Manage customers and delivery agents
          </p>
        </div>

        <button
          className="refresh-users-btn"
          onClick={fetchUsers}
        >
          ↻ Refresh
        </button>

      </div>

      {/* =========================
          SUMMARY CARDS
      ========================= */}

      <div className="users-summary">

        <div className="user-summary-card">
          <div className="summary-icon total-icon">
            👥
          </div>

          <div>
            <p>Total Users</p>
            <h2>
              {customers.length + agents.length}
            </h2>
          </div>
        </div>

        <div className="user-summary-card">
          <div className="summary-icon customer-icon">
            👤
          </div>

          <div>
            <p>Customers</p>
            <h2>{customers.length}</h2>
          </div>
        </div>

        <div className="user-summary-card">
          <div className="summary-icon agent-icon">
            🚚
          </div>

          <div>
            <p>Delivery Agents</p>
            <h2>{agents.length}</h2>
          </div>
        </div>

      </div>

      {/* =========================
          CUSTOMERS
      ========================= */}

      <div className="user-section">

        <div className="user-section-header">

          <div>
            <h2>Customers</h2>

            <p>
              Registered customers using Last Mile
            </p>
          </div>

          <span className="section-count customer-count">
            {customers.length}
          </span>

        </div>

        {customers.length === 0 ? (

          <div className="users-empty">
            <div className="users-empty-icon">
              👤
            </div>

            <h3>No customers found</h3>

            <p>
              There are currently no registered
              customers.
            </p>
          </div>

        ) : (

          <div className="users-table-wrapper">

            <table className="users-table">

              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Location</th>
                </tr>
              </thead>

              <tbody>

                {customers.map((customer) => (

                  <tr key={customer._id}>

                    <td>

                      <div className="user-profile">

                        <div className="user-avatar customer-avatar">
                          {getInitials(customer.name)}
                        </div>

                        <div className="user-info">
                          <strong>
                            {customer.name}
                          </strong>

                          <span>
                            Customer
                          </span>
                        </div>

                      </div>

                    </td>

                    <td>
                      <span className="user-email">
                        {customer.email}
                      </span>
                    </td>

                    <td>
                      {customer.phone || "N/A"}
                    </td>

                    <td>
                      <span className="role-badge customer-role">
                        CUSTOMER
                      </span>
                    </td>

                    <td>
                      <div className="location-cell">
                        <span className="location-icon">
                          📍
                        </span>

                        <span>
                          {customer.address ||
                            "Address not provided"}
                        </span>
                      </div>
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* =========================
          DELIVERY AGENTS
      ========================= */}

      <div className="user-section">

        <div className="user-section-header">

          <div>
            <h2>Delivery Agents</h2>

            <p>
              Agents responsible for delivering orders
            </p>
          </div>

          <span className="section-count agent-count">
            {agents.length}
          </span>

        </div>

        {agents.length === 0 ? (

          <div className="users-empty">
            <div className="users-empty-icon">
              🚚
            </div>

            <h3>No delivery agents found</h3>

            <p>
              There are currently no registered
              delivery agents.
            </p>
          </div>

        ) : (

          <div className="users-table-wrapper">

            <table className="users-table">

              <thead>
                <tr>
                  <th>Agent</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Location</th>
                </tr>
              </thead>

              <tbody>

                {agents.map((agent) => (

                  <tr key={agent._id}>

                    <td>

                      <div className="user-profile">

                        <div className="user-avatar agent-avatar">
                          {getInitials(agent.name)}
                        </div>

                        <div className="user-info">
                          <strong>
                            {agent.name}
                          </strong>

                          <span>
                            Delivery Agent
                          </span>
                        </div>

                      </div>

                    </td>

                    <td>
                      <span className="user-email">
                        {agent.email}
                      </span>
                    </td>

                    <td>
                      {agent.phone || "N/A"}
                    </td>

                    <td>
                      <span className="role-badge agent-role">
                        DELIVERY AGENT
                      </span>
                    </td>

                    <td>
                      <div className="location-cell">
                        <span className="location-icon">
                          📍
                        </span>

                        <span>
                          {agent.address ||
                            "Address not provided"}
                        </span>
                      </div>
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

export default Users;

