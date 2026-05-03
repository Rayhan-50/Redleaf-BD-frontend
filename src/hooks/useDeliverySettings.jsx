import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from './useAxiosPublic';

const useDeliverySettings = () => {
    const axiosPublic = useAxiosPublic();

    const { data: deliverySettings = { dhaka: 80, outside: 120 }, refetch, isLoading } = useQuery({
        queryKey: ['deliverySettings'],
        queryFn: async () => {
            const res = await axiosPublic.get('/settings/delivery');
            return res.data;
        }
    });

    return [deliverySettings, refetch, isLoading];
};

export default useDeliverySettings;
