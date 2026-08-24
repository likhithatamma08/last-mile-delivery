import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Users from "./pages/Users";
import DeliveryAgents from "./pages/DeliveryAgents";
import Zones from "./pages/Zones";
import Areas from "./pages/Areas";
import RateCards from "./pages/RateCards";
import Notifications from "./pages/Notifications";
import CreateOrder from "./pages/CreateOrder";
import DeliveryOrders from "./pages/DeliveryOrders";

import { AuthProvider, useAuth } from "./context/AuthContext";

// Protected Route
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Public Route
function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>

      {/* Root → Login */}
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      {/* Login */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Register */}
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Orders */}
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />

      {/* Create Order */}
      <Route
        path="/create-order"
        element={
          <ProtectedRoute>
            <CreateOrder />
          </ProtectedRoute>
        }
      />

      {/* Users */}
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        }
      />

      {/* Delivery Agents */}
      <Route
        path="/delivery-agents"
        element={
          <ProtectedRoute>
            <DeliveryAgents />
          </ProtectedRoute>
        }
      />

      {/* My Deliveries */}
      <Route
        path="/my-deliveries"
        element={
          <ProtectedRoute>
            <DeliveryOrders />
          </ProtectedRoute>
        }
      />

      {/* Zones */}
      <Route
        path="/zones"
        element={
          <ProtectedRoute>
            <Zones />
          </ProtectedRoute>
        }
      />

      {/* Areas */}
      <Route
        path="/areas"
        element={
          <ProtectedRoute>
            <Areas />
          </ProtectedRoute>
        }
      />

      {/* Rate Cards */}
      <Route
        path="/rate-cards"
        element={
          <ProtectedRoute>
            <RateCards />
          </ProtectedRoute>
        }
      />

      {/* Notifications */}
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />

      {/* Unknown URL → Login */}
      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />

    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;