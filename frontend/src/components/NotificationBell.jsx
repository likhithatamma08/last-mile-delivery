import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function NotificationBell() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

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
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const handleBellClick = () => {
    setShowNotifications((previous) => !previous);
  };

  const handleNotificationClick = async (
    notification
  ) => {
    try {
      if (!notification.isRead) {
        await API.patch(
          `/notifications/${notification._id}/read`
        );

        setNotifications((previous) =>
          previous.map((item) =>
            item._id === notification._id
              ? {
                  ...item,
                  isRead: true,
                }
              : item
          )
        );
      }

      if (notification.order?._id) {
        navigate(
          `/orders/${notification.order._id}`
        );
      } else {
        navigate("/notifications");
      }

      setShowNotifications(false);
    } catch (error) {
      console.error(
        "Error handling notification:",
        error
      );
    }
  };

  return (
    <div className="notification-bell-container">
      <button
        className="notification-bell"
        onClick={handleBellClick}
        aria-label="Notifications"
      >
        🔔

        {unreadCount > 0 && (
          <span className="notification-count">
            {unreadCount > 99
              ? "99+"
              : unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="notification-dropdown">
          <div className="notification-dropdown-header">
            <h3>Notifications</h3>

            {unreadCount > 0 && (
              <span>
                {unreadCount} unread
              </span>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="notification-empty">
              No notifications
            </div>
          ) : (
            <div className="notification-dropdown-list">
              {notifications
                .slice(0, 5)
                .map((notification) => (
                  <button
                    key={notification._id}
                    className={`notification-dropdown-item ${
                      notification.isRead
                        ? "read"
                        : "unread"
                    }`}
                    onClick={() =>
                      handleNotificationClick(
                        notification
                      )
                    }
                  >
                    <div>
                      <strong>
                        {notification.title}
                      </strong>

                      <p>
                        {notification.message}
                      </p>

                      <small>
                        {notification.createdAt
                          ? new Date(
                              notification.createdAt
                            ).toLocaleString()
                          : ""}
                      </small>
                    </div>
                  </button>
                ))}
            </div>
          )}

          <button
            className="view-all-notifications"
            onClick={() => {
              navigate("/notifications");
              setShowNotifications(false);
            }}
          >
            View All Notifications
          </button>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;