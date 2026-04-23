import { useState, useContext, useEffect } from "react";
import { NavLink, Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Menu, X, User, Users, Home, LogOut, Shield, Eye,
  Package, ShoppingBag, LayoutDashboard, ChevronRight, History, Leaf, PackagePlus, FileText
} from "lucide-react";
import Swal from "sweetalert2";
import useAdmin from "../hooks/useAdmin";
import Loading from "../components/Loading/Loading";
import { AuthContext } from "../Providers/AuthProvider";

const Dashboard = () => {
  const { user, logOut } = useContext(AuthContext);
  const [isAdmin, isAdminLoading] = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect from /dashboard root
  useEffect(() => {
    if (location.pathname === "/dashboard" && !isAdminLoading && user) {
      navigate(isAdmin ? "/dashboard/admin-overview" : "/dashboard/profile", { replace: true });
    }
  }, [isAdmin, isAdminLoading, user, navigate, location.pathname]);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setSidebarOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const closeSidebar = () => setSidebarOpen(false);

  const handleLogout = () => {
    Swal.fire({
      title: "Logout?",
      text: "You will be signed out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, logout",
      background: "#fff",
      customClass: {
        title: "font-['Poppins'] font-bold",
        popup: "rounded-3xl",
      }
    }).then((r) => {
      if (r.isConfirmed) {
        logOut().then(() => {
          Swal.fire({ icon: "success", title: "Logged out", showConfirmButton: false, timer: 1500 });
          navigate("/");
        });
      }
    });
  };

  if (isAdminLoading) return <Loading />;

  const adminNavItems = [
    { to: "/dashboard/admin-overview", icon: LayoutDashboard, label: "Overview" },
    { to: "/dashboard/add-product", icon: PackagePlus, label: "Add Product" },
    { to: "/dashboard/manage-products", icon: Package, label: "Manage Products" },
    { to: "/dashboard/manage-users", icon: Users, label: "Manage Users" },
    { to: "/dashboard/manage-payments", icon: ShoppingBag, label: "Manage Orders" },
    { to: "/dashboard/verify-payments", icon: Shield, label: "Verify Payments" },
    { to: "/dashboard/showContact", icon: Eye, label: "Contact Messages" },
  ];

  const userNavItems = [
    { to: "/dashboard/profile", icon: User, label: "My Profile" },
    { to: "/dashboard/my-bookings", icon: ShoppingBag, label: "My Orders" },
    { to: "/dashboard/payment-history", icon: History, label: "Order History" },
  ];

  const commonNavItems = [
    { to: "/", icon: Home, label: "Back to Store" },
  ];

  const navItems = isAdmin ? [...adminNavItems, ...commonNavItems] : [...userNavItems, ...commonNavItems];

  const renderLink = (item) => {
    const isActive = location.pathname === item.to;
    return (
      <NavLink
        key={item.to}
        to={item.to}
        onClick={closeSidebar}
        className={({ isActive: linkActive }) =>
          `group flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${linkActive
            ? "bg-red-600 text-white shadow-lg shadow-red-200"
            : "text-gray-500 hover:bg-red-50 hover:text-red-600"
          }`
        }
      >
        <div className="flex items-center gap-3">
          <item.icon className={`h-[18px] w-[18px] flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'group-hover:text-red-600'}`} />
          <span className={`text-sm font-bold tracking-tight truncate ${isActive ? 'text-white' : 'text-gray-900'}`}>{item.label}</span>
        </div>
        <ChevronRight className={`h-3.5 w-3.5 transition-all ${isActive ? 'text-white opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`} />
      </NavLink>
    );
  };

  return (
    <div className="fixed inset-0 flex flex-col lg:flex-row w-full h-full overflow-hidden bg-[#f9fafb] font-['Poppins',sans-serif]">
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md shadow-sm z-50 flex items-center justify-between px-6 border-b border-gray-100">
        <button
          onClick={() => setSidebarOpen(s => !s)}
          className="p-2.5 rounded-2xl bg-gray-50 hover:bg-gray-100 transition text-gray-700"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <Link to="/" className="flex items-center gap-2">
          <img
            src="https://ik.imagekit.io/2lax2ytm2/Logo-v1%20(1).png"
            alt="Redleaf-BD Logo"
            className="h-10 w-auto object-contain"
          />
        </Link>
        <div className="w-10" />
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 h-full w-80 bg-white border-r border-gray-100 shadow-2xl lg:shadow-none transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) z-[60] flex flex-col
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Brand */}
        <div className="p-6 border-b border-gray-50">
          <NavLink to="/" className="flex flex-col gap-2 group">
            <img
              src="https://ik.imagekit.io/2lax2ytm2/Logo-v1%20(1).png"
              alt="Redleaf-BD Logo"
              className="h-20 w-auto object-contain self-start"
            />
            <div className="flex items-center gap-1.5 px-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_rgba(230,57,70,0.5)]"></span>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                {isAdmin ? "Admin Command" : "Customer Hub"}
              </p>
            </div>
          </NavLink>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-6 py-8 space-y-2 no-scrollbar">
          {isAdmin && (
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-4 mb-3">Management</p>
          )}
          {isAdmin && adminNavItems.map(renderLink)}

          {!isAdmin && (
            <>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-4 mb-3">Your Account</p>
              {userNavItems.map(renderLink)}
            </>
          )}

          <div className="pt-4 mt-6 border-t border-gray-50 space-y-2">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-4 mb-3">Quick Links</p>
            {commonNavItems.map(renderLink)}
          </div>
        </nav>

        {/* User Section */}
        <div className="m-6 p-5 rounded-3xl bg-gray-50 border border-gray-100 shadow-inner">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <img
                src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'U')}&background=e63946&color=fff&size=128`}
                alt={user?.displayName || "User"}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-md flex-shrink-0"
              />
              {isAdmin && (
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-yellow-400 border-2 border-white flex items-center justify-center shadow-sm">
                  <Shield className="h-2.5 w-2.5 text-red-700" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-gray-900 truncate leading-tight">{user?.displayName || "User Account"}</p>
              <p className="text-[10px] font-bold text-gray-400 truncate mt-0.5">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="group w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-white hover:bg-red-600 text-gray-600 hover:text-white text-xs font-black transition-all border border-gray-200 hover:border-red-600 shadow-sm hover:shadow-red-200 active:scale-95"
          >
            <LogOut className="h-4 w-4 group-hover:rotate-12 transition-transform" />
            SIGN OUT
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative w-full h-full overflow-hidden flex flex-col pt-16 lg:pt-0">
        <div className="flex-1 w-full overflow-y-auto no-scrollbar">
          <div className="min-h-full w-full bg-[#f9fafb]">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 lg:hidden transition-all duration-300"
          onClick={closeSidebar}
        />
      )}
    </div>
  );
};

export default Dashboard;