import React, { useEffect, useState, useContext } from 'react';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import { Eye, EyeOff, ArrowRight, ShieldCheck, Leaf, Star } from 'lucide-react';

import SocialLogin from '../components/SocialLogin';
import { AuthContext } from '../Providers/AuthProvider';

const Login = () => {
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [captchaVerified, setCaptchaVerified] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signIn, user, loading } = useContext(AuthContext);

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    useEffect(() => {
        if (!loading && !user) {
            loadCaptchaEnginge(6);
        }
    }, [loading, user]);

    if (loading) {
        return <div className="min-h-screen w-screen bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center"><div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div></div>;
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    const onSubmit = (data) => {
        if (!termsAccepted) {
            Swal.fire({ title: 'Agree to Terms', icon: 'warning', confirmButtonColor: '#dc2626' });
            return;
        }
        signIn(data.email, data.password)
            .then(() => {
                Swal.fire({ title: 'Welcome back!', icon: 'success', showConfirmButton: false, timer: 1500 });
                navigate("/", { replace: true });
            })
            .catch(() => {
                Swal.fire({ title: 'Login Failed', text: 'Invalid email or password', icon: 'error', confirmButtonColor: '#dc2626' });
            });
    };

    const handleValidateCaptcha = () => {
        const captchaValue = document.getElementById('captchaInput')?.value;
        if (validateCaptcha(captchaValue)) {
            setCaptchaVerified(true);
            Swal.fire({ icon: 'success', title: 'Verified!', showConfirmButton: false, timer: 1000 });
        } else {
            setCaptchaVerified(false);
            Swal.fire({ icon: 'error', title: 'Wrong Captcha', text: 'Try again', confirmButtonColor: '#dc2626' });
        }
    };

    return (
        <div className="min-h-screen w-screen bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center font-['Poppins',sans-serif] relative overflow-hidden">
            
            {/* Background elements preserved for depth */}
            <div className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
                    backgroundSize: '22px 22px'
                }}
            />
            <div className="absolute top-1/4 -right-32 w-96 h-96 bg-red-500 rounded-full blur-[120px] opacity-30 pointer-events-none" />
            <div className="absolute bottom-0 -left-20 w-80 h-80 bg-red-900 rounded-full blur-[120px] opacity-40 pointer-events-none" />

            {/* Centered Form Card */}
            <div className="relative z-10 w-full max-w-lg p-8 md:p-12">
                <div className="text-center mb-10">
                    <Link to="/">
                        <img src="https://ik.imagekit.io/2lax2ytm2/Logo-v1%20(1).png" alt="Redleaf-BD" className="h-20 w-auto mx-auto object-contain brightness-0 invert mb-6" />
                    </Link>
                    <h2 className="text-white font-black text-4xl tracking-tight leading-none">Sign In</h2>
                    <p className="text-red-100 text-sm font-medium mt-3">Access your professional dashboard</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <input
                        type="email"
                        placeholder="Email identity"
                        {...register("email", { required: true })}
                        className="w-full px-6 py-4 text-sm font-bold bg-white/95 border-none rounded-2xl focus:outline-none focus:ring-4 focus:ring-yellow-400/50 text-gray-900 shadow-2xl"
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password path"
                            {...register("password", { required: true })}
                            className="w-full px-6 py-4 text-sm font-bold bg-white/95 border-none rounded-2xl focus:outline-none focus:ring-4 focus:ring-yellow-400/50 text-gray-900 shadow-2xl"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400">
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
                        <div className="shrink-0 bg-gray-900/40 p-3 rounded-xl border border-white/5 shadow-inner scale-90">
                            <LoadCanvasTemplate />
                        </div>
                        <div className="flex-1 flex flex-col gap-2">
                            <input
                                type="text"
                                id="captchaInput"
                                placeholder="Verification"
                                className="w-full px-4 py-3 text-xs font-bold bg-white border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-900 shadow-inner"
                            />
                            <button type="button" onClick={handleValidateCaptcha}
                                className={`w-full py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md ${captchaVerified ? 'bg-green-500 text-white' : 'bg-yellow-400 text-gray-900'}`}>
                                {captchaVerified ? 'Verified' : 'Verify'}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between px-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)}
                                className="w-4 h-4 rounded border-none text-yellow-400 accent-yellow-400" />
                            <span className="text-[10px] text-red-50 font-bold uppercase tracking-wider">Accept Terms</span>
                        </label>
                        <Link to="/forgot-password" size={10} className="text-[10px] text-yellow-400 font-bold uppercase tracking-widest">Recovery</Link>
                    </div>

                    <div className="pt-4 space-y-4">
                        <button
                            type="submit"
                            disabled={!termsAccepted}
                            className="w-full py-4 bg-gray-900 hover:bg-black text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-2xl disabled:opacity-30"
                        >
                            Sign In
                        </button>
                        <SocialLogin />
                    </div>

                    <div className="text-center pt-8">
                        <Link to="/signup" className="text-sm font-black text-white hover:text-yellow-400 uppercase tracking-widest transition-all">
                            Request New Membership
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;