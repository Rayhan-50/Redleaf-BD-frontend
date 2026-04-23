import { useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Users, Shield, Trash2, ArrowUpDown, ArrowUp, ArrowDown,
  Mail, Crown,
} from "lucide-react";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const USERS_PER_PAGE = 10;

const ManageUsers = () => {
  const axiosSecure   = useAxiosSecure();
  const queryClient   = useQueryClient();

  // Local input state (instant)
  const [searchInput, setSearchInput] = useState("");
  // Debounced value that actually drives the query
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField,   setSortField]   = useState("name");
  const [sortOrder,   setSortOrder]   = useState("asc");
  const [filterRole,  setFilterRole]  = useState("all");

  // Debounce search — 400ms
  useEffect(() => {
    const t = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1); // reset page on new search
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // ── Query ────────────────────────────────────────────────────────────────────
  const { data = { users: [], total: 0, totalPages: 1 }, isLoading, error, refetch } = useQuery({
    queryKey: ["users", searchQuery, currentPage, sortField, sortOrder, filterRole],
    queryFn: async () => {
      const res = await axiosSecure.get("/users", {
        params: {
          search: searchQuery || undefined,
          page:   currentPage,
          limit:  USERS_PER_PAGE,
          sort:   sortField,
          order:  sortOrder,
          role:   filterRole !== "all" ? filterRole : undefined,
        },
      });
      return res.data; // { users, total, totalPages }
    },
    keepPreviousData: true, // show stale data while fetching new page (no blank flash)
  });

  const { users, total, totalPages } = data;

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleSort = useCallback((field) => {
    setSortField(f => {
      if (f === field) setSortOrder(o => o === "asc" ? "desc" : "asc");
      else { setSortOrder("asc"); }
      return field;
    });
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  }, [totalPages]);

  const handleFilterRole = useCallback((e) => {
    setFilterRole(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleMakeAdmin = useCallback((user) => {
    Swal.fire({
      title: "Promote to Admin?",
      text: `Grant ${user.name} admin privileges?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, promote",
      background: "#fff",
      customClass: { title: "font-['Poppins'] font-bold text-gray-900", popup: "rounded-[32px] p-8" },
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.patch(`/users/admin/${user._id}`).then((res) => {
          if (res.data.modifiedCount > 0) {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            Swal.fire({
              position: "center", icon: "success",
              title: `${user.name} is now an Admin`,
              showConfirmButton: false, timer: 1500,
              customClass: { title: "font-['Poppins'] font-bold text-red-600", popup: "rounded-3xl" }
            });
          }
        }).catch((err) => Swal.fire({ icon: "error", title: "Failed", text: err.message }));
      }
    });
  }, [axiosSecure, queryClient]);

  const handleDeleteUser = useCallback((user) => {
    Swal.fire({
      title: "Delete Account?",
      text: `Permanently delete ${user.name}?`,
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete",
      background: "#fff",
      customClass: { title: "font-['Poppins'] font-bold text-gray-900", popup: "rounded-[32px] p-8" },
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/users/${user._id}`).then((res) => {
          if (res.data.deletedCount > 0) {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            Swal.fire({
              icon: "success", title: "User Deleted",
              text: `${user.name} removed.`,
              customClass: { title: "font-['Poppins'] font-bold", popup: "rounded-3xl" }
            });
          }
        }).catch((err) => Swal.fire({ icon: "error", title: "Deletion Failed", text: err.message }));
      }
    });
  }, [axiosSecure, queryClient]);

  const getSortIcon = (field) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1 h-3 w-3" />;
    return sortOrder === "asc" ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />;
  };

  // ── Skeleton ─────────────────────────────────────────────────────────────────
  const SkeletonRow = () => (
    <div className="bg-white rounded-[32px] shadow-sm p-6 animate-pulse border border-gray-100">
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
        <div className="w-12 h-12 bg-gray-100 rounded-2xl" />
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-gray-100 rounded-lg w-1/4" />
          <div className="h-4 bg-gray-100 rounded-lg w-1/2" />
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
          <div className="h-12 bg-gray-100 rounded-2xl w-full lg:w-32" />
          <div className="h-12 bg-gray-100 rounded-2xl w-full lg:w-24" />
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center p-10">
      <div className="text-center p-10 bg-white rounded-[32px] shadow-xl border border-red-50">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Users className="h-10 w-10 text-red-600" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">System Error</h2>
        <p className="text-gray-400 font-medium">{error.message}</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 lg:p-10 space-y-10 font-['Poppins',sans-serif]">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8 mb-4">
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex w-20 h-20 bg-red-600 rounded-[32px] items-center justify-center shadow-2xl shadow-red-200">
              <Users className="h-10 w-10 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-2">User Directory</h2>
              <p className="text-gray-400 font-bold text-sm tracking-wide uppercase">Managing permissions &amp; account status</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
            <div className="px-5 py-2.5 bg-red-50 rounded-2xl border border-red-100">
              <span className="text-red-600 font-black text-sm tracking-widest">{total} TOTAL USERS</span>
            </div>
            <select
              value={filterRole}
              onChange={handleFilterRole}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-gray-100 text-gray-600 text-xs font-black uppercase tracking-wider focus:outline-none focus:ring-4 focus:ring-red-50 focus:border-red-600 bg-white shadow-sm transition-all"
            >
              <option value="all">All Roles</option>
              <option value="admin">Administrators</option>
              <option value="user">Registered Users</option>
            </select>
          </div>
        </div>

        {/* Search + sort controls */}
        <div className="flex flex-col sm:flex-row gap-3 items-center mb-2">
          <div className="relative group flex-1 w-full">
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-16 pr-8 py-6 rounded-[32px] border border-gray-100 text-gray-700 text-base font-bold focus:outline-none focus:ring-4 focus:ring-red-50 focus:border-red-600 bg-white shadow-sm group-hover:shadow-md transition-all placeholder:text-gray-300"
            />
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-red-600 h-6 w-6 transition-colors" />
          </div>
          {/* Sort buttons */}
          <div className="flex gap-2 shrink-0">
            {["name","email"].map(field => (
              <button
                key={field}
                onClick={() => handleSort(field)}
                className={`flex items-center px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all ${sortField === field ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-500 border-gray-100 hover:border-red-200'}`}
              >
                {field} {getSortIcon(field)}
              </button>
            ))}
          </div>
        </div>

        {/* Users List */}
        <div className="mt-10 space-y-6">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          ) : users.length === 0 ? (
            <div className="bg-white rounded-[40px] p-20 text-center border border-dashed border-gray-200 shadow-inner">
              <div className="w-24 h-24 bg-gray-50 rounded-[32px] flex items-center justify-center mx-auto mb-6">
                <Users className="h-12 w-12 text-gray-200" />
              </div>
              <p className="text-xl font-black text-gray-900 tracking-tight">No Matches Found</p>
              <p className="text-gray-400 font-bold text-sm mt-1">Try a different search term or filter</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {users.map((user, index) => (
                <motion.div
                  key={user._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-[40px] shadow-sm hover:shadow-xl hover:shadow-red-900/5 transition-all duration-300 p-6 sm:p-8 border border-gray-50 flex flex-col lg:flex-row items-center gap-8 group"
                >
                  <div className="w-16 h-16 bg-red-600 rounded-[24px] flex items-center justify-center shadow-lg shadow-red-200 shrink-0 group-hover:rotate-6 transition-transform">
                    <span className="text-white font-black text-lg tracking-widest">
                      {index + 1 + (currentPage - 1) * USERS_PER_PAGE}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 text-center lg:text-left">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4 mb-2">
                      <h3 className="text-xl sm:text-2xl font-black text-gray-900 truncate tracking-tight uppercase">{user.name}</h3>
                      <div className="flex items-center justify-center lg:justify-start gap-2">
                        {user.role === "admin" ? (
                          <span className="px-3 py-1 bg-red-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                            <Crown size={10} /> MASTER
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-gray-100 text-gray-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-200">
                            CLIENT
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-400 font-bold text-xs tracking-wide">
                      <Mail size={12} className="text-gray-300" />
                      {user.email}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0">
                    {user.role !== "admin" && (
                      <button
                        onClick={() => handleMakeAdmin(user)}
                        className="w-full sm:w-auto flex items-center justify-center px-6 py-4 bg-yellow-400 hover:bg-yellow-500 text-red-900 rounded-2xl transition-all text-xs font-black uppercase tracking-widest shadow-md hover:shadow-yellow-100 active:scale-95"
                      >
                        <Shield className="mr-2 h-4 w-4" /> PROMOTE
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteUser(user)}
                      className="w-full sm:w-auto flex items-center justify-center px-6 py-4 bg-white hover:bg-red-600 text-gray-400 hover:text-white rounded-2xl transition-all text-xs font-black uppercase tracking-widest border border-gray-100 hover:border-red-600 shadow-sm active:scale-95"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> DELETE
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-14">
            <div className="bg-white rounded-[32px] p-2 border border-gray-100 shadow-sm flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-6 py-4 rounded-[24px] text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-red-50 hover:text-red-700 disabled:opacity-20 transition-all"
              >Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .reduce((acc, p, i, arr) => {
                  if (i > 0 && p - arr[i - 1] > 1) acc.push('...');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === '...' ? (
                    <span key={`ellipsis-${i}`} className="w-12 h-12 flex items-center justify-center text-gray-300 font-bold text-xs">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`w-12 h-12 rounded-[24px] text-xs font-black transition-all ${currentPage === p ? "bg-red-600 text-white shadow-lg shadow-red-200" : "text-gray-400 hover:bg-gray-100 hover:text-gray-900"}`}
                    >{p}</button>
                  )
                )}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-6 py-4 rounded-[24px] text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-red-50 hover:text-red-700 disabled:opacity-20 transition-all"
              >Next</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ManageUsers;