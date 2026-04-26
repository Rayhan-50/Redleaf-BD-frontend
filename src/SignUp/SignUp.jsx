import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Eye, EyeOff, ArrowRight, ShieldCheck, Leaf, Star, UploadCloud } from 'lucide-react';

import SocialLogin from "../components/SocialLogin";
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';
import { getAuth, signOut } from 'firebase/auth';
import { AuthContext } from "../Providers/AuthProvider";
import useAxiosPublic from "../hooks/useAxiosPublic";

const SignUp = () => {
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [captchaVerified, setCaptchaVerified] = useState(false);

    const axiosPublic = useAxiosPublic();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { createUser, updateUserProfile, user, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    const auth = getAuth();

    const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
    const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

    useEffect(() => { loadCaptchaEnginge(6); }, []);

    if (loading) {
        return <div className="min-h-screen w-screen bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center"><div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div></div>;
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    const handleValidateCaptcha = () => {
        const captchaValue = document.getElementById('signupCaptchaInput')?.value;
        if (validateCaptcha(captchaValue)) {
            setCaptchaVerified(true);
            Swal.fire({ icon: 'success', title: 'Verified!', showConfirmButton: false, timer: 1000 });
        } else {
            setCaptchaVerified(false);
            Swal.fire({ icon: 'error', title: 'Wrong Captcha', confirmButtonColor: '#dc2626' });
        }
    };

    const handleImageUpload = async (photo) => {
        const formData = new FormData();
        formData.append('image', photo);
        try {
            const response = await fetch(image_hosting_api, { method: 'POST', body: formData });
            const data = await response.json();
            return data.data.url;
        } catch { return null; }
    };

    const onSubmit = async (data) => {
        if (!termsAccepted) { Swal.fire({ title: 'Agree to Terms', icon: 'warning', confirmButtonColor: '#dc2626' }); return; }

        let photoURL = data.photoURL;
        if (data.photo && data.photo[0]) {
            photoURL = await handleImageUpload(data.photo[0]);
            if (!photoURL) { Swal.fire({ icon: 'error', title: 'Image Upload Failed', confirmButtonColor: '#dc2626' }); return; }
        }

        try {
            const result = await createUser(data.email, data.password);
            await updateUserProfile(data.name, photoURL);
            const userInfo = { uid: result.user.uid, name: data.name, email: data.email, photoURL, emailVerified: false };
            const res = await axiosPublic.post("/users", userInfo);

            if (res.data.insertedId) {
                reset();
                await signOut(auth);
                await Swal.fire({
                    title: 'Account Created!',
                    text: `Check ${data.email} to verify before signing in.`,
                    icon: 'success',
                    confirmButtonColor: '#dc2626',
                    confirmButtonText: 'Go to Login',
                });
                navigate("/login");
            }
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Signup Failed', text: error.message, confirmButtonColor: '#dc2626' });
        }
    };

    return (
        <div className="min-h-screen w-screen bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center font-['Poppins',sans-serif] relative overflow-hidden">
            
            {/* Background elements preserved for depth */}
            <div className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
                    backgroundSize: '22px 22px'
                }}
            />
            <div className="absolute top-1/4 -right-24 w-72 h-72 bg-red-500 rounded-full blur-[100px] opacity-40 pointer-events-none" />
            <div className="absolute bottom-10 -left-20 w-80 h-80 bg-red-900 rounded-full blur-[100px] opacity-40 pointer-events-none" />

            {/* Centered Form Card */}
            <div className="relative z-10 w-full max-w-xl p-8 md:p-12">
                <div className="text-center mb-8">
                    <Link to="/">
                        <img src="https://ik.imagekit.io/2lax2ytm2/Logo-v1%20(1).png" alt="Redleaf-BD" className="h-20 w-auto mx-auto object-contain brightness-0 invert mb-6" />
                    </Link>
                    <h2 className="text-white font-black text-4xl tracking-tight leading-none">Create Account</h2>
                    <p className="text-red-100 text-sm font-medium mt-3">Join the high-finesse fresh network</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Full Name *"
                            {...register("name", { required: true })}
                            className="w-full px-5 py-3.5 text-xs font-bold bg-white/95 border-none rounded-2xl focus:outline-none focus:ring-4 focus:ring-yellow-400/50 text-gray-900 shadow-xl"
                        />
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Photo URL"
                                {...register("photoURL")}
                                className="w-full px-5 py-3.5 pr-10 text-xs font-bold bg-white/95 border-none rounded-2xl focus:outline-none focus:ring-4 focus:ring-yellow-400/50 text-gray-900 shadow-xl"
                            />
                            <UploadCloud size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    <input
                        type="email"
                        placeholder="Email Address *"
                        {...register("email", { required: true })}
                        className="w-full px-5 py-3.5 text-xs font-bold bg-white/95 border-none rounded-2xl focus:outline-none focus:ring-4 focus:ring-yellow-400/50 text-gray-900 shadow-xl"
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Secure Password *"
                            {...register("password", { required: true, minLength: 6 })}
                            className="w-full px-5 py-3.5 text-xs font-bold bg-white/95 border-none rounded-2xl focus:outline-none focus:ring-4 focus:ring-yellow-400/50 text-gray-900 shadow-xl"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl">
                        <div className="shrink-0 bg-gray-900/40 p-3 rounded-xl border border-white/5 scale-90">
                            <LoadCanvasTemplate />
                        </div>
                        <div className="flex-1 flex flex-col gap-2">
                            <input
                                type="text"
                                id="signupCaptchaInput"
                                placeholder="Security Code"
                                className="w-full px-4 py-2.5 text-xs font-bold bg-white border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-900 shadow-inner"
                            />
                            <button type="button" onClick={handleValidateCaptcha}
                                className={`w-full py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${captchaVerified ? 'bg-green-500 text-white' : 'bg-yellow-400 text-gray-900'}`}>
                                {captchaVerified ? 'Verified' : 'Verify'}
                            </button>
                        </div>
                    </div>

                    <label className="flex items-center gap-2.5 cursor-pointer pt-1">
                        <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)}
                            className="w-4 h-4 rounded border-none text-yellow-400 accent-yellow-400" />
                        <span className="text-[10px] text-red-50 font-bold uppercase tracking-widest">Accept Membership Terms</span>
                    </label>

                    <div className="pt-4 space-y-4">
                        <button
                            type="submit"
                            disabled={!termsAccepted}
                            className="w-full py-4 bg-gray-900 hover:bg-black text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-2xl disabled:opacity-30"
                        >
                            Establish Account
                        </button>
                        <SocialLogin />
                    </div>

                    <div className="text-center pt-4">
                        <Link to="/login" className="text-[10px] font-black text-white/60 hover:text-white uppercase tracking-[0.2em] transition-all">
                            Existing Personnel Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUp;