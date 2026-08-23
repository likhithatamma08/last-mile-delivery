import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
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

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* Orders */}
        <Route
          path="/orders"
          element={<Orders />}
        />

        {/* Create Order */}
        <Route
          path="/create-order"
          element={<CreateOrder />}
        />

        {/* Users */}
        <Route
          path="/users"
          element={<Users />}
        />

        {/* Delivery Agents */}
        <Route
          path="/delivery-agents"
          element={<DeliveryAgents />}
        />

        {/* Delivery Agent - My Deliveries */}
<Route
  path="/my-deliveries"
  element={<DeliveryOrders />}
/>

        {/* Zones */}
        <Route
          path="/zones"
          element={<Zones />}
        />

        {/* Areas */}
        <Route
          path="/areas"
          element={<Areas />}
        />

        {/* Rate Cards */}
        <Route
          path="/rate-cards"
          element={<RateCards />}
        />

        {/* Notifications */}
        <Route
          path="/notifications"
          element={<Notifications />}
        />

        {/* Default */}
        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;