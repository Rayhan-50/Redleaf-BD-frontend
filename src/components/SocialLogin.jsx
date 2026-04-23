import { FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { toast } from "react-toastify";

const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
        <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
    </svg>
);

const SocialLogin = () => {
    const { googleSignIn } = useAuth();
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();

    const handleGoogleSignIn = () => {
        googleSignIn()
            .then(result => {
                const userInfo = {
                    email: result.user?.email,
                    name: result.user?.displayName,
                    photoURL: result.user?.photoURL || null
                }
                return axiosPublic.post('/users', userInfo);
            })
            .then(res => {
                if (res.data) {
                    toast.success('Successfully signed in with Google!');
                    navigate('/');
                }
            })
            .catch(error => {
                let errorMessage = 'Failed to sign in with Google. Please try again.';

                // Firebase authentication errors
                if (error?.code === 'auth/popup-closed-by-user') {
                    errorMessage = 'Sign-in was cancelled. Please try again.';
                } else if (error?.code === 'auth/popup-blocked') {
                    errorMessage = 'Popup was blocked. Please allow popups for this site and try again.';
                } else if (error?.code === 'auth/network-request-failed') {
                    errorMessage = 'Network error. Please check your internet connection and try again.';
                }
                // Backend API errors
                else if (error?.response?.data?.message) {
                    errorMessage = error.response.data.message;
                } else if (error?.response?.status === 500) {
                    errorMessage = 'Server error. Please try again later.';
                } else if (error?.response?.status === 404) {
                    errorMessage = 'Server not available. Please check your connection.';
                } else if (error?.message) {
                    errorMessage = error.message;
                }

                toast.error(errorMessage);
            });
    }

    return (
        <div className="flex flex-col items-center w-full">
            <div className="divider text-yellow-400 font-black my-5 before:bg-white/20 after:bg-white/20">OR</div>
            <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center px-6 py-2.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors duration-200 text-gray-600 font-medium shadow-sm hover:shadow-md group"
            >
                <GoogleIcon />
                <span className="group-hover:text-gray-900">Sign in with Google</span>
            </button>
        </div>
    );
};

export default SocialLogin;