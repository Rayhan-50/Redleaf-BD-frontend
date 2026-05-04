import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";

import useAdmin from "../hooks/useAdmin";
import { AuthContext } from "../Providers/AuthProvider";
// import { AuthContext } from "../providers/AuthProvider";




const AdminRoute = ({ children }) => {


    const [isAdmin, isAdminLoading] = useAdmin();
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading || isAdminLoading) {
        return <progress className="progress w-56 text-center"></progress>
    }

    if (user && isAdmin) {
        return children;
    }
    return <Navigate to="/" state={{ from: location }} replace></Navigate>
};

export default AdminRoute;