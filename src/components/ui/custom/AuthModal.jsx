import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useGoogleLogin } from '@react-oauth/google';
import { FiEye, FiEyeOff, FiX } from 'react-icons/fi';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth.jsx';

export function AuthModal({ isOpen, onClose }) {
const { login, register, googleAuth, isLoading, error, clearError } = useAuth();

const [isLogin, setIsLogin] = useState(true);
const [showPassword, setShowPassword] = useState(false);

const [formData, setFormData] = useState({
name: '',
email: '',
password: '',
confirmPassword: '',
});

const [formErrors, setFormErrors] = useState({});

const googleLogin = useGoogleLogin({
onSuccess: async (tokenInfo) => {
try {
const googleResponse = await axios.get(
`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
{
headers: {
Authorization: `Bearer ${tokenInfo?.access_token}`,
Accept: 'application/json',
},
}
);
    const result = await googleAuth(googleResponse.data);

    if (result.success) {
      toast({ title: 'Welcome!', description: 'Logged in with Google' });
      handleClose();
    }
  } catch (error) {
    console.error('Google auth error:', error?.response?.data || error.message);
    toast({
      title: 'Error',
      description: 'Google login failed',
      variant: 'destructive',
    });
  }
},
onError: () => {
  toast({
    title: 'Error',
    description: 'Google login failed',
    variant: 'destructive',
  });
},

});

if (!isOpen) return null;

const handleClose = () => {
setFormData({ name: '', email: '', password: '', confirmPassword: '' });
setFormErrors({});
clearError();
onClose();
};

const validateForm = () => {
const errors = {};

if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
  errors.email = 'Please enter a valid email';
}

if (!formData.password || formData.password.length < 6) {
  errors.password = 'Password must be at least 6 characters';
}

if (!isLogin) {
  if (!formData.name.trim()) {
    errors.name = 'Name is required';
  }
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
}

setFormErrors(errors);
return Object.keys(errors).length === 0;

};

const handleInputChange = (e) => {
const { name, value } = e.target;


setFormData((prev) => ({ ...prev, [name]: value }));

if (formErrors[name]) {
  setFormErrors((prev) => ({ ...prev, [name]: '' }));
}

};

const handleSubmit = async (e) => {
e.preventDefault();

if (!validateForm()) return;

let result;

if (isLogin) {
  result = await login(formData.email, formData.password);
} else {
  result = await register(formData.name, formData.email, formData.password);
}

if (result.success) {
  toast({
    title: 'Welcome!',
    description: isLogin
      ? 'Logged in successfully'
      : 'Account created successfully',
  });
  handleClose();
} else {
  toast({
    title: isLogin ? 'Login Failed' : 'Registration Failed',
    description: result.error,
    variant: 'destructive',
  });
}

};

return (
<>
{/* Backdrop */} <div
     className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
     onClick={handleClose}
   />

  {/* Modal */}
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
    <div
      className="bg-white rounded-2xl shadow-2xl max-w-md w-full pointer-events-auto max-h-[90vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex justify-between items-center">
        <h2 className="text-white font-bold text-lg">
          {isLogin ? 'Sign In' : 'Create Account'}
        </h2>
        <button onClick={handleClose}>
          <FiX className="text-white" size={20} />
        </button>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border rounded">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {!isLogin && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          )}

          <button className="w-full bg-indigo-600 text-white py-2 rounded">
            {isLoading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="my-4 text-center text-sm">OR</div>

        <button
          onClick={() => !isLoading && googleLogin()}
          className="w-full flex items-center justify-center gap-2 border py-2 rounded"
        >
          <FcGoogle /> Continue with Google
        </button>

        <p className="text-center text-sm mt-4">
          {isLogin ? 'New user?' : 'Already have an account?'}{' '}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              clearError();
            }}
            className="text-indigo-600"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  </div>
</>


);
}
