import { createBrowserRouter } from "react-router-dom";

// Layouts
import Main from "../Layout/Main";
import Dashboard from "../Layout/Dashboard";

// Public Pages
import Home from "../pages/Home";
import Login from "../Login/Login";
import SignUp from "../SignUp/SignUp";
import NotFound from "../pages/NotFoumd";
import Loading from "../components/Loading/Loading";
import AboutUs from "../pages/AboutUs";
import ContactUs from "../pages/ContactUs";
import AllProducts from "../pages/AllProducts";
import Offers from "../pages/Offers";
import Corporate from "../pages/Corporate";
import Export from "../pages/Export";
import Outlets from "../pages/Outlets";
import ImpactStories from "../pages/ImpactStories";
import HalalInvestment from "../pages/HalalInvestment";
import Blog from "../pages/Blog";

// Dashboard — Admin Pages
import AdminDashboard from "../pages/Dashboard/AdminDashboard";
import ManageUsers from "../pages/Dashboard/ManageUsers";
import ManageProducts from "../pages/Dashboard/ManageProducts";
import ManagePayments from "../pages/Dashboard/ManagePayments";
import VerifyPayments from "../pages/Dashboard/VerifyPayments";
import ShowContactData from "../pages/Dashboard/ShowContactData";
import AddProduct from "../pages/Dashboard/addProduct";
import AddBlog from "../pages/Dashboard/AddBlog";

// Dashboard — User Pages
import Profile from "../pages/Dashboard/Profile";
import PaymentHistory from "../pages/Dashboard/PaymentHistory";
import MyBookings from "../pages/Dashboard/MyBookings";
import Payment from "../pages/Dashboard/Payment";

// Route Guards
import PrivateRoute from "./PrivateRoute";
import useAdmin from "../hooks/useAdmin";

// Admin Route Guard Component
const AdminRoute = ({ children }) => {
  const [isAdmin, isAdminLoading] = useAdmin();
  if (isAdminLoading) return <Loading />;
  if (!isAdmin) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
        <span className="text-3xl">🔒</span>
      </div>
      <p className="text-xl font-bold text-gray-800">Access Denied</p>
      <p className="text-gray-500 text-sm">This page is for administrators only.</p>
    </div>
  );
  return children;
};

export const router = createBrowserRouter([
  // ── Public / Main Layout ─────────────────────────────────────────────────
  {
    path: "/",
    element: <Main />,
    children: [
      { index: true, element: <Home /> },
      { path: "products", element: <AllProducts /> },
      { path: "offers", element: <Offers /> },
      { path: "corporate", element: <Corporate /> },
      { path: "export", element: <Export /> },
      { path: "outlets", element: <Outlets /> },
      { path: "impact", element: <ImpactStories /> },
      { path: "halal-investment", element: <HalalInvestment /> },
      { path: "blog", element: <Blog /> },
      { path: "about",   element: <AboutUs /> },
      { path: "contact", element: <ContactUs /> },
      { path: "login",   element: <Login /> },
      { path: "signup",  element: <SignUp /> },
    ],
  },

  // ── Dashboard Layout ──────────────────────────────────────────────────────
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
    children: [
      // Admin Routes
      {
        path: "admin-overview",
        element: <AdminRoute><AdminDashboard /></AdminRoute>,
      },
      {
        path: "manage-users",
        element: <AdminRoute><ManageUsers /></AdminRoute>,
      },
      {
        path: "manage-products",
        element: <AdminRoute><ManageProducts /></AdminRoute>,
      },
      {
        path: "add-product",
        element: <AdminRoute><AddProduct /></AdminRoute>,
      },
      {
        path: "add-blog",
        element: <AdminRoute><AddBlog /></AdminRoute>,
      },
      {
        path: "manage-payments",
        element: <AdminRoute><ManagePayments /></AdminRoute>,
      },
      {
        path: "verify-payments",
        element: <AdminRoute><VerifyPayments /></AdminRoute>,
      },

      {
        path: "showContact",
        element: <AdminRoute><ShowContactData /></AdminRoute>,
      },

      // User Routes
      { path: "profile",         element: <Profile /> },
      { path: "payment-history", element: <PaymentHistory /> },
      { path: "my-bookings",     element: <MyBookings /> },
      { path: "payment/:orderId", element: <Payment /> },
    ],
  },

  // ── 404 ───────────────────────────────────────────────────────────────────
  { path: "*", element: <NotFound /> },
]);