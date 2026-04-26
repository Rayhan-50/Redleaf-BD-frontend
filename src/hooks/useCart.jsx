import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import useAxiosSecure from "./useAxiosSecure";
import { AuthContext } from "../Providers/AuthProvider";

const useCart = () => {
    const axiosSecure = useAxiosSecure();
    const { user, loading } = useContext(AuthContext);

    const { refetch, data: cart = [] } = useQuery({
        queryKey: ['cart', user?.email], 
        enabled: !loading && !!user?.email && !!localStorage.getItem('access-token'),
        queryFn: async () => {
            const res = await axiosSecure.get(`/carts?email=${user.email}`);
            return res.data || [];
        }
    });

    return [cart, refetch];
};

export default useCart;