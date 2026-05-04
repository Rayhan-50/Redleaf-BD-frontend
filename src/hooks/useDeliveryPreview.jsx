import { useEffect, useState, useCallback } from 'react';
import useAxiosSecure from './useAxiosSecure';

/**
 * useDeliveryPreview
 * ─────────────────────────────────────────────────────────────────────────────
 * Calls POST /delivery/preview on the backend to get a server-computed
 * delivery charge + free-delivery hints.  Debounced so rapid location changes
 * don't flood the API.
 *
 * @param {object} opts
 * @param {Array}  opts.cartItems        - Cart items array
 * @param {string} opts.deliveryLocation - 'Dhaka' | 'Outside Dhaka' | ''
 * @param {string} [opts.city]
 * @param {string} [opts.address]
 * @param {boolean} [opts.enabled]       - Skip the call when false (e.g. empty cart)
 *
 * @returns {{
 *   charge: number,
 *   isFree: boolean,
 *   reason: string|null,
 *   freeRuleProduct: string|null,
 *   hints: Array,
 *   isLoading: boolean,
 *   error: string|null
 * }}
 */
const useDeliveryPreview = ({
  cartItems = [],
  deliveryLocation = '',
  city = '',
  address = '',
  enabled = true,
} = {}) => {
  const axiosSecure = useAxiosSecure();

  const [state, setState] = useState({
    charge: 0,
    isFree: false,
    reason: null,
    freeRuleProduct: null,
    hints: [],
    isLoading: false,
    error: null,
  });

  const fetchPreview = useCallback(async () => {
    if (!enabled || cartItems.length === 0) {
      setState(s => ({ ...s, charge: 0, isFree: false, reason: null, hints: [], isLoading: false, error: null }));
      return;
    }

    setState(s => ({ ...s, isLoading: true, error: null }));
    try {
      const res = await axiosSecure.post('/delivery/preview', {
        cartItems,
        deliveryLocation,
        city,
        address,
      });
      setState({
        charge:          res.data.charge         ?? 0,
        isFree:          res.data.isFree         ?? false,
        reason:          res.data.reason         ?? null,
        freeRuleProduct: res.data.freeRuleProduct ?? null,
        hints:           res.data.hints          ?? [],
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setState(s => ({
        ...s,
        isLoading: false,
        error: err.response?.data?.message || 'Failed to compute delivery',
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // stringify to avoid stale closure on array reference changes
    JSON.stringify(cartItems.map(i => ({ id: i._id || i.productId, qty: i.quantity }))),
    deliveryLocation,
    city,
    address,
    enabled,
  ]);

  useEffect(() => {
    // Debounce: wait 350ms after last change before hitting the API
    const timer = setTimeout(fetchPreview, 350);
    return () => clearTimeout(timer);
  }, [fetchPreview]);

  return state;
};

export default useDeliveryPreview;
