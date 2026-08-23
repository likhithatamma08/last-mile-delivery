import { useEffect, useState } from "react";
import API from "../services/api";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await API.get("/notifications");

      setNotifications(
        response.data.notifications || []
      );
    } catch (error) {
      console.error(
        "Error fetching notifications:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load notifications"
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // MARK AS READ
  // ============================================

  const handleMarkAsRead = async (id) => {
    try {
      await API.patch(
        `/notifications/${id}/read`
      );

      setNotifications((previous) =>
        previous.map((notification) =>
          notification._id === id
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );
    } catch (error) {
      console.error(
        "Error marking notification as read:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to mark notification as read"
      );
    }
  };

  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <div className="notifications-page">
        <h1>Notifications</h1>
        <p>Loading notifications...</p>
      </div>
    );
  }

  // ============================================
  // ERROR
  // ============================================

  if (error) {
    return (
      <div className="notifications-page">
        <h1>Notifications</h1>

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
    <div className="notifications-page">

      <div className="notifications-page-header">

        <div>
          <h1>Notifications</h1>

          <p>
            Stay updated with your orders
          </p>
        </div>

        <strong>
          Total Notifications:{" "}
          {notifications.length}
        </strong>

      </div>

      {notifications.length === 0 ? (

        <div className="details-card">
          <p>No notifications available.</p>
        </div>

      ) : (

        <div className="notifications-list">

          {notifications.map(
            (notification) => (

              <div
                key={notification._id}
                className={`notification-card ${
                  notification.isRead
                    ? "read"
                    : "unread"
                }`}
              >

                <div className="notification-content">

                  <div className="notification-header">

                    <h3>
                      {notification.title}
                    </h3>

                    {!notification.isRead && (
                      <span className="unread-badge">
                        NEW
                      </span>
                    )}

                  </div>

                  <p>
                    {notification.message}
                  </p>

                  {notification.order && (
                    <p>
                      <strong>
                        Order:
                      </strong>{" "}
                      {
                        notification.order
                          .orderNumber
                      }
                    </p>
                  )}

                  <small>
                    {notification.createdAt
                      ? new Date(
                          notification.createdAt
                        ).toLocaleString()
                      : ""}
                  </small>

                </div>

                {!notification.isRead && (

                  <button
                    onClick={() =>
                      handleMarkAsRead(
                        notification._id
                      )
                    }
                  >
                    Mark as Read
                  </button>

                )}

              </div>

            )
          )}

        </div>

      )}

    </div>
  );
}

export default Notifications;