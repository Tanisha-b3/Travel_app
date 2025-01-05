import { useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import './Hero.css';
import axios from 'axios';
import { Button } from "../button"; 
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogClose
} from "@/components/ui/dialog";
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

function Hero() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const users = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    if (users) {
      navigate('/Create-trip');
    }
  }, [users, navigate]);

  const Login = useGoogleLogin({
    onSuccess: async (tokenInfo) => {
      setLoading(true);
      await GetUserProfile(tokenInfo);
    },
    onError: (error) => {
      console.log("Google Login Error:", error);
      toast.error("Google Login Failed. Please try again.");
      setLoading(false);
    },
    scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email"
  });

  const GetUserProfile = async (tokenInfo) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: 'application/json'
          }
        }
      );
      localStorage.setItem('user', JSON.stringify(response.data));
      setOpen(false);
      navigate('/Create-trip');
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch Google user profile:", error);
      toast.error("Unable to retrieve user profile. Try again later.");
      setLoading(false);
    }
  };

  const handleGetStartedClick = () => {
    if (users) {
      navigate('/Create-trip');
    } else {
      setOpen(true);
    }
  };

  return (
    <div className="hero-container bg-gradient-to-r from-indigo-200 via-blue-100 to-gray-100 min-h-screen flex flex-col items-center justify-center">
      <div className="text-center px-6">
        <h1 className="font-extrabold text-4xl md:text-6xl lg:text-7xl mb-6 text-gray-900 leading-tight tracking-tight">
          <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-pink-500 to-purple-500">
            Discover Your Next Adventure with AI:
          </span>
          <br />
          Personalized Itineraries at Your Fingertips
        </h1>
        <p className="text-gray-700 text-lg md:text-xl lg:text-2xl mb-10 font-medium max-w-3xl mx-auto leading-relaxed">
          Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.
        </p>
        <button 
          onClick={handleGetStartedClick} 
          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 text-white py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out"
        >
          Get Started, It's Free
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="dialog-content bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg mx-auto">
          <DialogClose asChild>
            <button className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 focus:ring-2 focus:ring-gray-300">
              <span className="sr-only">Close</span>
              <span className="text-2xl">&times;</span>
            </button>
          </DialogClose>
          <DialogHeader>
            <DialogDescription className="text-center">
              <img src='/Logo.png' alt='Google login' className='w-60 h-15 mx-auto rounded-full shadow-md' />
              <h2 className="font-extrabold text-2xl mt-6">Sign in with Google</h2>
              <p className="text-gray-500 mt-2 text-sm md:text-base">Sign in with Google authentication securely.</p>
              <Button 
                disabled={loading} 
                onClick={Login} 
                className={`w-full flex items-center justify-center gap-3 py-3 mt-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transform ${
                  loading ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'
                } transition-all duration-300`}
              >
                <FcGoogle className="text-2xl" />
                {loading ? 'Signing in...' : 'Sign in with Google'}
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Hero;
