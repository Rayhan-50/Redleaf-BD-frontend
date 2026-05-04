import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from './useAxiosPublic';
import { DEFAULT_ZONES } from '../utils/deliveryDefaults';

const useDeliverySettings = () => {
    const axiosPublic = useAxiosPublic();

    const { data: deliverySettings = { zones: DEFAULT_ZONES }, refetch, isLoading } = useQuery({
        queryKey: ['deliverySettings'],
        queryFn: async () => {
            const res = await axiosPublic.get('/settings/delivery');
            return res.data;
        },
        staleTime: 5 * 60 * 1000, // 5 min — settings change rarely
    });

    return [deliverySettings, refetch, isLoading];
};

export default useDeliverySettings;
