import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";

// ─── Eager (critical-path) imports ────────────────────────────────────────────
// These are needed immediately on first paint — do NOT make them lazy.
import Main      from "../Layout/Main";
import Dashboard from "../Layout/Dashboard";
import Home      from "../pages/Home";
import Login     from "../Login/Login";
import SignUp    from "../SignUp/SignUp";
import NotFound  from "../pages/NotFoumd";
import Loading   from "../components/Loading/Loading";
import PrivateRoute from "./PrivateRoute";
import useAdmin  from "../hooks/useAdmin";

// ─── Lazy (code-split) public pages ───────────────────────────────────────────
// Each becomes its own JS chunk loaded only when the user navigates there.
const AllProducts    = lazy(() => import("../pages/AllProducts"));
const Offers         = lazy(() => import("../pages/Offers"));
const Corporate      = lazy(() => import("../pages/Corporate"));
const Export         = lazy(() => import("../pages/Export"));
const Outlets        = lazy(() => import("../pages/Outlets"));
const ImpactStories  = lazy(() => import("../pages/ImpactStories"));
const HalalInvestment = lazy(() => import("../pages/HalalInvestment"));
const Blog           = lazy(() => import("../pages/Blog"));
const AboutUs        = lazy(() => import("../pages/AboutUs"));
const ContactUs      = lazy(() => import("../pages/ContactUs"));

// ─── Lazy dashboard — Admin pages ─────────────────────────────────────────────
const AdminDashboard  = lazy(() => import("../pages/Dashboard/AdminDashboard"));
const ManageUsers     = lazy(() => import("../pages/Dashboard/ManageUsers"));
const ManageProducts  = lazy(() => import("../pages/Dashboard/ManageProducts"));
const ManagePayments  = lazy(() => import("../pages/Dashboard/ManagePayments"));
const VerifyPayments  = lazy(() => import("../pages/Dashboard/VerifyPayments"));
const ShowContactData = lazy(() => import("../pages/Dashboard/ShowContactData"));
const AddProduct      = lazy(() => import("../pages/Dashboard/addProduct"));
const AddBlog         = lazy(() => import("../pages/Dashboard/AddBlog"));
const DeliverySettings = lazy(() => import("../pages/Dashboard/DeliverySettings"));

// ─── Lazy dashboard — User pages ──────────────────────────────────────────────
const Profile        = lazy(() => import("../pages/Dashboard/Profile"));
const PaymentHistory = lazy(() => import("../pages/Dashboard/PaymentHistory"));
const MyBookings     = lazy(() => import("../pages/Dashboard/MyBookings"));
const Payment        = lazy(() => import("../pages/Dashboard/Payment"));

// ─── Suspense wrapper shorthand ────────────────────────────────────────────────
// Wraps any lazy component with a Loading fallback automatically.
const S = ({ children }) => (
  <Suspense fallback={<Loading />}>
    {children}
  </Suspense>
);

// ─── Admin Route Guard ─────────────────────────────────────────────────────────
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

// ─── Router ────────────────────────────────────────────────────────────────────
export const router = createBrowserRouter([
  // ── Public / Main Layout ─────────────────────────────────────────────────
  {
    path: "/",
    element: <Main />,
    children: [
      { index: true,                     element: <Home /> },                         // Eager — above fold
      { path: "products",                element: <S><AllProducts /></S> },
      { path: "offers",                  element: <S><Offers /></S> },
      { path: "corporate",               element: <S><Corporate /></S> },
      { path: "export",                  element: <S><Export /></S> },
      { path: "outlets",                 element: <S><Outlets /></S> },
      { path: "impact",                  element: <S><ImpactStories /></S> },
      { path: "halal-investment",        element: <S><HalalInvestment /></S> },
      { path: "blog",                    element: <S><Blog /></S> },
      { path: "about",                   element: <S><AboutUs /></S> },
      { path: "contact",                 element: <S><ContactUs /></S> },
      { path: "login",                   element: <Login /> },                         // Eager — auth critical
      { path: "signup",                  element: <SignUp /> },                        // Eager — auth critical
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
      { path: "admin-overview",  element: <AdminRoute><S><AdminDashboard /></S></AdminRoute> },
      { path: "manage-users",    element: <AdminRoute><S><ManageUsers /></S></AdminRoute> },
      { path: "manage-products", element: <AdminRoute><S><ManageProducts /></S></AdminRoute> },
      { path: "add-product",     element: <AdminRoute><S><AddProduct /></S></AdminRoute> },
      { path: "add-blog",        element: <AdminRoute><S><AddBlog /></S></AdminRoute> },
      { path: "manage-payments", element: <AdminRoute><S><ManagePayments /></S></AdminRoute> },
      { path: "verify-payments", element: <AdminRoute><S><VerifyPayments /></S></AdminRoute> },
      { path: "showContact",     element: <AdminRoute><S><ShowContactData /></S></AdminRoute> },
      { path: "delivery-settings", element: <AdminRoute><S><DeliverySettings /></S></AdminRoute> },

      // User Routes
      { path: "profile",          element: <S><Profile /></S> },
      { path: "payment-history",  element: <S><PaymentHistory /></S> },
      { path: "my-bookings",      element: <S><MyBookings /></S> },
      { path: "payment/:orderId", element: <S><Payment /></S> },
    ],
  },

  // ── 404 ───────────────────────────────────────────────────────────────────
  { path: "*", element: <NotFound /> },
]);