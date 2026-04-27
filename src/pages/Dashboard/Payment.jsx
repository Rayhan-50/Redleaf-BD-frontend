import { useState, useContext } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import { CreditCard, Truck, Banknote, ShieldCheck, HelpCircle, Loader2, Package, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { AuthContext } from '../../Providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useImageUpload from '../../hooks/useImageUpload';

const stripePromise = loadStripe(import.meta.env.VITE_Payment_Gateway_PK);

const BKASH_NUMBER = '01817619847';
const NAGAD_NUMBER = '01708768054';

const Payment = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const { user } = useContext(AuthContext);

    const [paymentMethod, setPaymentMethod] = useState('card');
    const [manualTxId, setManualTxId] = useState('');
    const [manualSender, setManualSender] = useState('');
    const [processing, setProcessing] = useState(false);

    // Image Upload Hook for Screenshot
    const { uploadImage, uploading: imageUploading } = useImageUpload();
    const [screenshotUrl, setScreenshotUrl] = useState('');
    const [screenshotFile, setScreenshotFile] = useState(null);

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
    const orderIdStr = order?.orderIdString || order?._id?.slice(-8).toUpperCase();

    const handleCODPayment = async () => {
        setProcessing(true);
        try {
            const paymentData = {
                email: user?.email,
                amount: totalPrice,
                transactionId: `COD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                orderId: order._id,
                paymentMethod: 'cod'
            };
            
            await axiosSecure.post('/payments', paymentData);
            
            Swal.fire({
                icon: "success",
                title: "Order Placed!",
                text: "Your order will be delivered soon via Cash on Delivery.",
                confirmButtonColor: '#0A3D2A',
            });
            navigate('/dashboard/payment-history');
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Failed to place order', confirmButtonColor: '#dc2626' });
        } finally {
            setProcessing(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setScreenshotFile(file);
        try {
            const url = await uploadImage(file);
            setScreenshotUrl(url);
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Upload Failed', text: 'Failed to upload screenshot.' });
            setScreenshotFile(null);
        }
    };

    const handleManualPayment = async () => {
        if (!manualTxId || !manualSender) {
            Swal.fire({ icon: 'warning', title: 'Missing Information', text: 'Please enter both Sender Number and Transaction ID.', confirmButtonColor: '#dc2626' });
            return;
        }

        // Validate Phone Format (BD)
        const phoneRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;
        if (!phoneRegex.test(manualSender)) {
            Swal.fire({ icon: 'error', title: 'Invalid Number', text: 'Please enter a valid Bangladeshi mobile number.', confirmButtonColor: '#dc2626' });
            return;
        }

        setProcessing(true);
        try {
            const paymentData = {
                email: user?.email,
                amount: totalPrice,
                transactionId: manualTxId,
                senderNumber: manualSender,
                screenshot: screenshotUrl,
                orderId: order._id,
                paymentMethod: paymentMethod // bkash_manual or nagad_manual
            };
            
            await axiosSecure.post('/payments', paymentData);
            
            Swal.fire({
                icon: "success",
                title: "Payment Under Review",
                text: "Your payment has been submitted and is pending verification.",
                confirmButtonColor: '#0A3D2A',
            });
            navigate('/dashboard/payment-history');
        } catch (error) {
            Swal.fire({ 
                icon: 'error', 
                title: 'Payment Failed', 
                text: error.response?.data?.message || 'Something went wrong.',
                confirmButtonColor: '#dc2626' 
            });
        } finally {
            setProcessing(false);
        }
    };

    if (isOrderLoading) {
        return <div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin text-[#0A3D2A] h-10 w-10" /></div>;
    }

    if (!order) {
        return <div className="text-red-500 font-bold text-center p-6 mt-10 text-xl">Order not found.</div>;
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen font-['Poppins']">
            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Payment Selection */}
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Complete Payment</h2>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Select your preferred payment method</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { id: 'card', label: 'Card', icon: CreditCard },
                            { id: 'bkash_manual', label: 'bKash', icon: Banknote },
                            { id: 'nagad_manual', label: 'Nagad', icon: Banknote },
                            { id: 'cod', label: 'COD', icon: Truck },
                        ].map((method) => (
                            <div 
                                key={method.id}
                                onClick={() => {
                                    setPaymentMethod(method.id);
                                    setManualTxId('');
                                    setManualSender('');
                                    setScreenshotUrl('');
                                    setScreenshotFile(null);
                                }}
                                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center gap-2 text-center ${paymentMethod === method.id ? 'border-[#0A3D2A] bg-green-50/50 shadow-md scale-105' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                            >
                                <method.icon className={`h-6 w-6 ${paymentMethod === method.id ? 'text-[#0A3D2A]' : 'text-gray-400'}`} />
                                <span className={`text-[9px] font-black uppercase tracking-widest ${paymentMethod === method.id ? 'text-[#0A3D2A]' : 'text-gray-500'}`}>
                                    {method.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 sm:p-8 overflow-hidden min-h-[400px]">
                        <AnimatePresence mode="wait">
                            {/* STRIPE CARD */}
                            {paymentMethod === 'card' && (
                                <motion.div key="card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><CreditCard className="text-blue-600" size={20} /></div>
                                        <h3 className="text-xl font-bold text-gray-900 tracking-tight">Secure Card Payment</h3>
                                    </div>
                                    <Elements stripe={stripePromise}>
                                        <CheckoutForm />
                                    </Elements>
                                </motion.div>
                            )}

                            {/* MANUAL PAYMENT (bKash/Nagad) */}
                            {(paymentMethod === 'bkash_manual' || paymentMethod === 'nagad_manual') && (
                                <motion.div key="manual" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === 'bkash_manual' ? 'bg-pink-50 text-pink-600' : 'bg-orange-50 text-orange-600'}`}>
                                            <Banknote size={20} />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                                            {paymentMethod === 'bkash_manual' ? 'bKash' : 'Nagad'} Manual Payment
                                        </h3>
                                    </div>
                                    
                                    <div className={`border rounded-xl p-5 space-y-2 ${paymentMethod === 'bkash_manual' ? 'bg-pink-50/50 border-pink-100 text-pink-900' : 'bg-orange-50/50 border-orange-100 text-orange-900'}`}>
                                        <p className="text-sm font-semibold">1. Open your App and select <span className="font-bold">Send Money</span>.</p>
                                        <p className="text-sm font-semibold">2. Send exact <span className="font-bold">৳{totalPrice.toLocaleString()}</span> to <span className="font-mono font-bold bg-white px-2 py-1 rounded">{paymentMethod === 'bkash_manual' ? BKASH_NUMBER : NAGAD_NUMBER}</span></p>
                                        <p className="text-sm font-semibold">3. Use <span className="font-bold bg-white px-2 py-1 rounded mx-1">{orderIdStr}</span> as your reference.</p>
                                        <p className="text-sm font-semibold">4. Enter your Sender Number, TxID, and upload a screenshot below.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Sender Mobile Number <span className="text-red-500">*</span></label>
                                            <input 
                                                type="text" 
                                                placeholder="e.g. 01712345678" 
                                                value={manualSender} 
                                                onChange={e => setManualSender(e.target.value)}
                                                className="w-full px-5 py-4 rounded-xl border border-gray-200 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-gray-100 focus:border-[#0A3D2A] transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Transaction ID (TxID) <span className="text-red-500">*</span></label>
                                            <input 
                                                type="text" 
                                                placeholder="e.g. 9J2A3BC4DEF" 
                                                value={manualTxId} 
                                                onChange={e => setManualTxId(e.target.value)}
                                                className="w-full px-5 py-4 rounded-xl border border-gray-200 text-sm font-bold uppercase focus:outline-none focus:ring-4 focus:ring-gray-100 focus:border-[#0A3D2A] transition-all"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Payment Screenshot (Optional)</label>
                                            <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors">
                                                <input 
                                                    type="file" 
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                />
                                                {imageUploading ? (
                                                    <div className="flex items-center justify-center gap-2 text-gray-500"><Loader2 className="animate-spin" size={16} /> Uploading...</div>
                                                ) : screenshotUrl ? (
                                                    <div className="flex items-center justify-center gap-2 text-green-600 font-bold">
                                                        <ShieldCheck size={18} /> Screenshot Uploaded!
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-2 text-gray-400">
                                                        <ImageIcon size={24} />
                                                        <span className="text-xs font-semibold">Click or drag image to upload</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <button 
                                            onClick={handleManualPayment}
                                            disabled={processing || imageUploading}
                                            className={`w-full text-white py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-2 mt-4 ${paymentMethod === 'bkash_manual' ? 'bg-pink-600 hover:bg-pink-700' : 'bg-orange-600 hover:bg-orange-700'} disabled:opacity-50`}
                                        >
                                            {processing ? <Loader2 className="animate-spin" size={16} /> : <ShieldCheck size={16} />}
                                            {processing ? 'Verifying...' : 'Verify & Submit Payment'}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* CASH ON DELIVERY */}
                            {paymentMethod === 'cod' && (
                                <motion.div key="cod" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col items-center justify-center h-full space-y-6 text-center py-10">
                                    <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-2">
                                        <Truck className="h-10 w-10 text-amber-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Cash on Delivery</h3>
                                        <p className="text-sm font-medium text-gray-500 max-w-sm mx-auto leading-relaxed">
                                            You can pay in cash to our courier when you receive the products at your doorstep.
                                        </p>
                                    </div>
                                    <button 
                                        onClick={handleCODPayment}
                                        disabled={processing}
                                        className="w-full max-w-sm bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-50 py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-amber-200"
                                    >
                                        {processing ? <Loader2 className="animate-spin" size={16} /> : <Package size={16} />}
                                        {processing ? 'Processing...' : 'Confirm Order (COD)'}
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-[#0A3D2A] text-white rounded-[24px] p-6 sm:p-8 shadow-xl sticky top-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8"><ShieldCheck size={100} className="text-white/5 -rotate-12 transform translate-x-4 -translate-y-4" /></div>
                        
                        <h3 className="text-lg font-black uppercase tracking-widest text-green-100 mb-6 border-b border-white/10 pb-4">Order Summary</h3>
                        
                        <div className="space-y-4 mb-8 relative z-10">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-medium text-green-200">Order ID</span>
                                <span className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded border border-white/20 tracking-wider">{orderIdStr}</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-sm font-medium text-green-50">Total Items</span>
                                <span className="text-sm font-bold bg-white/10 px-3 py-1 rounded-full">{order.items?.length || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-green-50">Subtotal</span>
                                <span className="text-sm font-bold">৳{(totalPrice - (order.deliveryCharge || 0)).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-green-50">Delivery Charge</span>
                                <span className="text-sm font-bold">৳{(order.deliveryCharge || 0).toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="border-t border-white/20 pt-6 mt-auto relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-widest text-green-200 mb-1">Total Payable</p>
                            <p className="text-4xl font-black tracking-tighter">৳{totalPrice.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Payment;
