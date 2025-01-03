import { Button } from "../button";
import './Header.css';
import { FcGoogle } from "react-icons/fc";
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogClose
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import MyTrip from "@/components/My_trip/My_trip";
import { useNavigate } from "react-router-dom";


function Header() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const users = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    console.log(users);
  }, [users]);

  const Login = useGoogleLogin({
    onSuccess: async (tokenInfo) => {
      console.log(tokenInfo);
      await GetUserProfile(tokenInfo);
    },
    onError: (error) => {
      console.log("Google Login Error:", error);
      toast.error("Google Login Failed");
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
      console.log(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Failed to fetch Google user profile:", error);
      toast.error("Failed to retrieve user profile");
    }
  };

  return (
    <>
      <div className="flex justify-between px-6 py-4 shadow-lg items-center bg-white">
        <div className="flex items-center gap-4">
          <img className="h-10" src="/Logo.png" alt="Logo" />
        </div>

        {/* Flex container to center the title */}
        <div className="flex-1 flex justify-center text-3xl font-bold text-gray-800">
          Trip-Planner
        </div>

        <div className="flex items-center gap-6">
          {users ? (
            <div className="flex items-center gap-4">
              <Button onClick={<MyTrip/>} variant="outline" className="rounded-full border-gray-300 hover:bg-gray-100">
                My Trips
              </Button>
              <Popover>
                <PopoverTrigger>
                  <img
                    src={users?.picture}
                    alt="User Profile"
                    className="h--6 w-6 "
                  />
                </PopoverTrigger>
                <PopoverContent className="p-4 border border-gray-200 shadow-lg bg-white rounded-md">
                  <h2
                    className="cursor-pointer text-red-600 hover:text-red-800 text-center"
                    onClick={() => {
                      googleLogout();
                      localStorage.clear();
                      window.location.reload();
                    }}
                  >
                    Log Out
                  </h2>
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <Button
              onClick={() => setOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-lg shadow-md hover:from-indigo-500 hover:to-blue-500 transition-all duration-300"
            >
              Get Started
            </Button>
          )}
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="rounded-xl shadow-2xl border border-gray-300 bg-white p-6">
            <DialogClose asChild>
              <button className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 focus:ring-2 focus:ring-gray-300">
                <span className="sr-only">Close</span>
                <span className="text-2xl">&times;</span>
              </button>
            </DialogClose>
            <DialogHeader className="text-center">
              <DialogDescription>
                <img src="/Logo.png" alt="Google Login" className="mx-auto h-15 rounded-lg shadow-sm w-60" />
                <h2 className="text-2xl font-bold mt-4 text-gray-800">Sign in with Google</h2>
                <p className="text-gray-500 mt-2 text-sm">
                  Securely sign in using Google authentication.
                </p>
                <Button
                  disabled={loading}
                  onClick={Login}
                  className={`w-full mt-6 flex items-center justify-center gap-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <FcGoogle className="text-2xl" />
                  {loading ? 'Signing in...' : 'Sign in with Google'}
                </Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <hr className="mt-2 border-gray-200" />
    </>
  );
}

export default Header;
