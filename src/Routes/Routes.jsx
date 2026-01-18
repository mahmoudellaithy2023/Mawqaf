import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import DashboardLayout from "../layout/DashboardLayout";

// Pages
import Home from "./../pages/Home/index";
import Stations from "../pages/Stations/Stations";
import Community from "../pages/Community/Community";
import StationDetails from "../pages/StationDetails/Index";
import LineDetailsPage from "../pages/LineDetails/LineDetails";
import Profile from "../pages/Profile/Profile";
import Chat from "../pages/Community/Chat";
import { SocketProvider } from "../../context/socketContext";
import PaymentSuccess from "../pages/Payment/PaymentSuccess";

// Market
import Marketplace from "../pages/Market/marketPlace";
import ProductDetail from "../pages/Market/ProductDetail";
import Cart from "../pages/Market/Cart";
import CashPayment from "../pages/Market/CashPayment";
import OrderConfirmation from "../pages/Market/OrderConfirmation";

// Auth
import AuthLayout from "../pages/Auth";
import LoginForm from "../components/Auth/LoginForm";
import SignupForm from "../components/Auth/SignupForm";
import VerifyEmailForm from "../components/Auth/VerifyEmailForm";
import ForgotPasswordForm from "../components/Auth/ForgotPasswordForm";
import VerifyResetCodeForm from "../components/Auth/VerifyResetCodeForm";
import ResetPasswordForm from "../components/Auth/ResetPasswordForm";
import ProtectedRoute from "../ProtectedRoutes/ProtectedRoutes";
import RoleBasedRoute from "../ProtectedRoutes/RoleBasedRoute";

// Manager Pages
import ManagerDashboard from "../pages/Manager/Dashboard/ManagerDashboard";
import ManagerStations from "../pages/Manager/Stations/ManagerStations";
import ManagerCommunity from "../pages/Manager/Community/ManagerCommunity";
import CreateAccount from "../pages/Manager/CreateAccount/CreateAccount";

// Admin Pages
import AdminDashboard from "../pages/Admin/Dashboard/AdminDashboard";
import AdminLines from "../pages/Admin/Lines/AdminLines";
import AdminVehicles from "../pages/Admin/Vehicles/AdminVehicles";
import AdminVehicleTrips from "../pages/Admin/Vehicles/AdminVehicleTrips";
import StayTuned from "../pages/StayTuned";
import ErrorPage from "../pages/ErrorPage";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    
    children: [
      { index: true, element: <Home /> },
      { path: "home", element: <Home /> },
      { path: "stations", element: <Stations /> },
      { path: "stations/:id", element: <StationDetails /> },
      {
        path: "stations/:stationId/lines/:lineId",
        element: <LineDetailsPage />,
      },
      {
        path: "community",
        element: (
          <ProtectedRoute>
            <Community />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile/:id",
        element: (
          <ProtectedRoute>
            {" "}
            <Profile />{" "}
          </ProtectedRoute>
        ),
      },

      // Market
      {
        path: "marketplace",
        element: (
          <ProtectedRoute>
            {" "}
            <Marketplace />{" "}
          </ProtectedRoute>
        ),
      },
      { path: "marketplace/:id", element: <ProductDetail /> },
      { path: "cart", element: <Cart /> },
      { path: "cash-payment", element: <CashPayment /> },
      { path: "order-confirmation/:id", element: <OrderConfirmation /> },
      {
        path: "chat/:id",
        element: (
          <SocketProvider>
            <Chat />
          </SocketProvider>
        ),
      },
      { path: "payment-success", element: <PaymentSuccess /> },
      { path: "stay-tuned", element: <StayTuned /> },
      //  Auth
      {
        path: "auth",
        element: <AuthLayout />,
        children: [
          { index: true, element: <LoginForm /> },
          { path: "login", element: <LoginForm /> },
          { path: "register", element: <SignupForm /> },
          { path: "verify-email", element: <VerifyEmailForm /> },
          { path: "forgot-password", element: <ForgotPasswordForm /> },
          { path: "verify-reset-code", element: <VerifyResetCodeForm /> },
          { path: "reset-password/:token", element: <ResetPasswordForm /> },
        ],
      },
    ],
  },

  // Manager Routes
  {
    path: "/manager",
    element: <RoleBasedRoute allowedRoles={["MANAGER"]} />,
    children: [
      {
        path: "",
        element: <DashboardLayout />,
        children: [
          { path: "dashboard", element: <ManagerDashboard /> },
          { path: "stations", element: <ManagerStations /> },
          { path: "community", element: <ManagerCommunity /> },
          { path: "create-account", element: <CreateAccount /> },
        ],
      },
    ],
  },

  // Admin Routes
  {
    path: "/admin",
    element: <RoleBasedRoute allowedRoles={["ADMIN"]} />,
    children: [
      {
        path: "",
        element: <DashboardLayout />,
        children: [
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "lines", element: <AdminLines /> },
          { path: "vehicles/:vehicleId/trips", element: <AdminVehicleTrips /> },
          { path: "vehicles", element: <AdminVehicles /> },
        ],
      },
    ],
  },
]);

export default routes;
