import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import useAxiosSecure from "./useAxiosSecure";
import { AuthContext } from "../Providers/AuthProvider";

const usePayments = () => {
  const axiosSecure = useAxiosSecure();
  const { user, loading } = useContext(AuthContext);

  const { refetch, data: payments = [], isLoading, error } = useQuery({
    queryKey: ["payments", user?.email],
    enabled: !loading && !!user?.email && !!localStorage.getItem('access-token'),
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`);
      return res.data || [];
    },
  });

  return [payments, refetch, isLoading, error];
};

export default usePayments;