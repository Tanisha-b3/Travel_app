import { useState } from "react";
import { Button } from "../button";
import { FcGoogle } from "react-icons/fc";
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from "axios";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import MyTrip from "../../ui/trip";

function Header() {
  const [loading, setLoading] = useState(false);
  const [showMyTrips, setShowMyTrips] = useState(false);
  const users = JSON.parse(localStorage.getItem('user')) || null;

  const Login = useGoogleLogin({
    onSuccess: async (tokenInfo) => {
      await GetUserProfile(tokenInfo);
    },
    onError: (error) => {
      console.error("Google Login Error:", error);
      toast({
        title: "Error",
        description: "Google Login Failed",
        variant: "destructive",
      });
    },
    scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email"
  });

  const GetUserProfile = async (tokenInfo) => {
    try {
      setLoading(true);
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
      toast({
        title: "Success",
        description: "Logged in successfully!",
        variant: "default",
      });
      window.location.reload();
    } catch (error) {
      console.error("Failed to fetch Google user profile:", error);
      toast({
        title: "Error",
        description: "Failed to retrieve user profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getEmailFirstLetter = (email) => {
    return email?.charAt(0).toUpperCase() || 'U';
  };

  const handleLogoClick = () => {
    window.location.href = "/";
  };

  const handleLogout = () => {
    googleLogout();
    localStorage.clear();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
      variant: "default",
    });
    window.location.href = "/";
  };

  const handleLoginClick = () => {
    toast({
      title: "Login",
      description: (
        <div className="flex flex-col gap-3 p-2">
          <p className="text-center text-gray-700">Sign in with Google to continue</p>
          <Button
            disabled={loading}
            onClick={Login}
            className={`w-full flex items-center justify-center gap-2 text-black ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <FcGoogle className="text-lg" />
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </Button>
        </div>
      ),
      variant: "default",
    });
  };

  const handleMyTripsClick = () => {
    if (!users) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to view your trips",
        variant: "destructive",
      });
      return;
    }
    setShowMyTrips(true);
  };

  return (
    <>
      {/* Header with background image */}
      <header 
        className="sticky top-0 z-50 w-full bg-cover bg-center"
        style={{ backgroundImage: "url('/header-bg.jpg')" }}
      >
        {/* Semi-transparent overlay */}
        <div className="bg-black/30 backdrop-blur-sm">
          <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <div 
              onClick={handleLogoClick}
              className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
            >
              <img className="h-10 w-auto " src="/Logo.png" alt="Logo" />
              </div>
              <div 
              onClick={handleLogoClick}
              className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
            >
              <h1 className="text-xl font-bold text-white sm:text-2xl pr-20">
                ExploraTrails
              </h1>
              </div>
            

            <div className="flex items-center gap-3 sm:gap-4">
              {users ? (
                <>
                  <Button 
                    onClick={handleMyTripsClick}
                    variant="outline" 
                    className="hidden sm:flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-full border border-white/30 hover:border-white/50 text-black hover:bg-white/10 transition-all"
                  >
                    <span>My Trips</span>
                  </Button>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      {users.picture ? (
                        <img 
                          src={users.picture} 
                          alt="Profile" 
                          className="h-10 w-10 rounded-full border-2 border-white/30 hover:border-white/50 cursor-pointer transition-all object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-500 text-white font-bold border-2 border-white/30 hover:border-white/50 cursor-pointer transition-all">
                          {getEmailFirstLetter(users.email)}
                        </div>
                      )}
                    </PopoverTrigger>
                    <PopoverContent 
                      align="end" 
                      className="w-48 p-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                    >
                      <button 
                        onClick={handleLogout} 
                        className="w-full px-4 py-2 text-left text-red-500 hover:bg-red-50 rounded-md text-sm font-medium transition-colors"
                      >
                        Log Out
                      </button>
                    </PopoverContent>
                  </Popover>
                </>
              ) : (
                <Button
                  onClick={handleLoginClick}
                  className="px-4 py-2 text-sm font-medium rounded-full bg-black text-indigo-600 hover:bg-gray-100 shadow-sm hover:shadow-md transition-all"
                >
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Login</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* My Trips Modal */}
      {showMyTrips && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setShowMyTrips(false)}
        />
      )}

      {showMyTrips && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-200 m-4">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-gray-900">My Saved Trips</h2>
              <button 
                className="p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
                onClick={() => setShowMyTrips(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-60px)]">
              <MyTrip />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;