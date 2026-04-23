import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../Providers/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Package, Lock, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const CheckoutForm = () => {
    const [error, setError] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [processing, setProcessing] = useState(false);

    const { orderId } = useParams();
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Fetch specific order data
    const { data: order, isLoading: isOrderLoading } = useQuery({
        queryKey: ['order', orderId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/orders/${orderId}`);
            return res.data;
        },
        enabled: !!orderId,
    });

    const totalPrice = order?.totalAmount || 0;

    useEffect(() => {
        if (totalPrice > 0) {
            axiosSecure.post('/create-payment-intent', { price: totalPrice })
                .then(res => {
                    if (res.data?.clientSecret) {
                        setClientSecret(res.data.clientSecret);
                    }
                })
                .catch(err => console.error("Failed to create payment intent", err));
        }
    }, [axiosSecure, totalPrice]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements || !order) return;

        const card = elements.getElement(CardElement);
        if (!card) return;

        setProcessing(true);
        setError('');

        try {
            const { error: paymentMethodError } = await stripe.createPaymentMethod({
                type: 'card',
                card,
            });

            if (paymentMethodError) throw new Error(paymentMethodError.message);

            const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: card,
                    billing_details: {
                        email: user?.email || 'anonymous',
                        name: user?.displayName || 'anonymous'
                    }
                }
            });

            if (confirmError) throw new Error(confirmError.message);

            if (paymentIntent.status === 'succeeded') {
                setTransactionId(paymentIntent.id);

                const paymentData = {
                    email: user.email,
                    amount: totalPrice,
                    transactionId: paymentIntent.id,
                    orderId: order._id, // Relate to the order
                    paymentMethod: 'card',
                };

                const res = await axiosSecure.post('/payments', paymentData);

                if (res.data?.insertedId) {
                    Swal.fire({
                        icon: "success",
                        title: "Payment Successful!",
                        text: "Your order has been officially processed.",
                        confirmButtonColor: '#dc2626',
                    });
                    navigate('/dashboard/payment-history');
                }
            }
        } catch (err) {
            console.error("Payment error:", err);
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setProcessing(false);
        }
    };

    if (isOrderLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="animate-spin text-[#0A3D2A] h-8 w-8" />
            </div>
        );
    }

    if (!order) {
        return <div className="text-red-500 font-bold text-center p-6">Order not found or access denied.</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-2 text-green-700 text-sm font-semibold bg-green-50 p-3 rounded-xl border border-green-100">
                <Lock className="h-4 w-4" />
                <span>Payments are verified, secure, and encrypted.</span>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-600">
                            <Package className="h-4 w-4" />
                            <span>Total Items</span>
                        </div>
                        <span className="font-bold text-gray-800">{order.items?.length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                        <span className="font-bold text-gray-900">Total Amount</span>
                        <span className="font-extrabold text-red-600 text-lg">৳{totalPrice.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#0A3D2A]/20 focus-within:border-[#0A3D2A] transition-all">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#111827',
                                fontFamily: '"Inter", sans-serif',
                                '::placeholder': { color: '#9CA3AF' },
                            },
                            invalid: { color: '#ef4444' },
                        },
                    }}
                />
            </div>

            {error && (
                <div className="text-red-600 text-sm font-semibold px-2">{error}</div>
            )}

            <button
                type="submit"
                disabled={!stripe || !clientSecret || processing}
                className="w-full bg-[#0A3D2A] hover:bg-green-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3.5 px-4 rounded-xl font-bold transition shadow-md flex justify-center items-center gap-2"
            >
                {processing ? (
                    <>
                        <Loader2 className="animate-spin h-5 w-5" /> Processing...
                    </>
                ) : (
                    `Pay ৳${totalPrice.toLocaleString()}`
                )}
            </button>
        </form>
    );
};

export default CheckoutForm;