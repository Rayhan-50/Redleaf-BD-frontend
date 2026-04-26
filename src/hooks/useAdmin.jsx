import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';
// import { AuthContext } from '../providers/AuthProvider';
import { useContext } from 'react';
import { AuthContext } from '../Providers/AuthProvider';

const useAdmin = () => {
    const { user, loading } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const {data: isAdmin, isPending: isAdminLoading} = useQuery({
        queryKey: [user?.email, 'isAdmin'],
        enabled: !loading && !!user?.email && !!localStorage.getItem('access-token'), // Only run if user email exists and token is ready
        queryFn: async () =>{
            try {
                const res = await axiosSecure.get(`/users/admin/${user.email}`);
                return res.data?.admin || false;
            } catch (error) {
                // If 403 (forbidden), user is not admin - this is expected for normal users
                if (error.response?.status === 403) {
                    return false;
                }
                // For other errors, rethrow
                throw error;
            }
        }
    })
    return [isAdmin || false, isAdminLoading]
};

export default useAdmin;