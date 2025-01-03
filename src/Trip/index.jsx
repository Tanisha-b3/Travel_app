import { AI_PROMPT, Budget } from '@/constants/options';
import { SelectTravelList } from '@/constants/options';
import './index.css';
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { chatSession } from '@/components/Service/AIModel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader
} from "@/components/ui/dialog";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import axios from 'axios';
import { setDoc } from 'firebase/firestore';
import { doc } from "firebase/firestore";
import { db } from '@/components/Service/Firebase';
import { useNavigate } from 'react-router-dom';

function Create_trip() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    destination: "",
    days: "",
    budget: "",
    people: ""
  });
  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const Login = useGoogleLogin({
    onSuccess: async (tokenInfo) => {
      console.log(tokenInfo);
      await GetUserProfile(tokenInfo); // Ensure asynchronous flow
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
      setOpen(false); // Close dialog
      OnGenerateTrip(); // Call trip generation after login
    } catch (error) {
      console.error("Failed to fetch Google user profile:", error);
      toast.error("Failed to retrieve user profile");
    }
  };

  const OnGenerateTrip = async () => {
    const user = localStorage.getItem('user');
    if (!user) {
      setOpen(true); // Open login modal if not logged in
      return;
    }

    // Check if all required fields are filled
    if (!formData?.destination || !formData?.days || !formData?.budget || !formData.people) {
      toast("Please fill All the Details");
      return;
    }

    setLoading(true);

    // Generate the final prompt with user's input
    const Final_Prompt = AI_PROMPT
      .replace('{location}', formData?.destination)
      .replace('{totalDays}', formData?.days)
      .replace('{people}', formData?.people)
      .replace('{budget}', formData?.budget);

    console.log(Final_Prompt);

    try {
      const result = await chatSession.sendMessage(Final_Prompt);
      const tripData = await result?.response.text();
      console.log("--", tripData);

      setLoading(false);
      SaveTrip(tripData); // Save trip with returned data
    } catch (error) {
      console.error("Error generating trip:", error);
      setLoading(false);
      toast.error("Failed to generate trip");
    }
  };

  const SaveTrip = async (TripData) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));
    const docId = Date.now().toString();

    try {
      await setDoc(doc(db, "AITrips", docId), {
        userChoice: formData,
        tripData: JSON.parse(TripData),
        userEmail: user?.email,
        id: docId
      });
      setLoading(false);
      navigate('/View-Trip/' + docId);
    } catch (error) {
      console.error("Failed to save trip:", error);
      setLoading(false);
      toast.error("Failed to save trip");
    }
  };

  return (
    <>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
        <h2 className="font-bold text-4xl text-center text-gray-800">Tell us your Travel preferences 🌴🏕️</h2>

        <p className="mt-4 text-center text-gray-600 text-xl">
          Provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className="text-2xl font-semibold text-gray-700">What is your Destination?</h3>
            <input
              className="w-full bg-white mt-3 p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Destination"
              onChange={(e) => handleInputChange('destination', e.target.value)}
            />
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-700">How many days are you staying?</h3>
            <input
              type="number"
              placeholder="Ex. 3"
              className="w-full bg-white mt-3 p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => handleInputChange('days', e.target.value)}
            />
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-2xl font-semibold text-gray-700">What is your Budget?</h3>
          <div className='grid grid-cols-3 gap-6 mt-6'>
            {Budget.map((item, index) => (
              <div
                key={index}
                onClick={() => handleInputChange('budget', item.title)}
                className={`p-4 border rounded-lg shadow-md cursor-pointer transition-all duration-300 ease-in-out hover:shadow-xl ${formData?.budget === item.title && 'border-blue-500 shadow-xl'}`}
              >
                {item.icon && (
                  <img src={item.icon} className="w-16 h-16 object-contain mb-3" alt={item.title} />
                )}
                <h3 className='font-bold text-lg'>{item.title}</h3>
                <p className='text-sm text-gray-500'>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-2xl font-semibold text-gray-700">Who are you travelling with?</h3>
          <div className='grid grid-cols-3 gap-6 mt-6'>
            {SelectTravelList.map((item, index) => (
              <div
                key={index}
                onClick={() => handleInputChange('people', item.people)}
                className={`p-4 border rounded-lg shadow-md cursor-pointer transition-all duration-300 ease-in-out hover:shadow-xl ${formData.people === item.people && 'border-blue-500 shadow-xl'}`}
              >
                {item.icon && (
                  <img src={item.icon} className="w-16 h-16 object-contain mb-3" alt={item.title} />
                )}
                <h3 className='font-bold text-lg'>{item.title}</h3>
                <p className='text-sm text-gray-500'>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className='mt-12 flex justify-end'>
          <Button
            disabled={loading}
            onClick={OnGenerateTrip}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-lg hover:bg-gradient-to-l hover:from-indigo-600 hover:to-blue-500 transition-all duration-300"
          >
            {loading ? <AiOutlineLoading3Quarters className='animate-spin h-6 w-6' /> : 'Generate Plan'}
          </Button>
        </div>

        <Dialog open={open}>
          <DialogContent>
            <DialogHeader>
              <DialogDescription>
                <img src='/ex.png' className='h-20 mx-auto mb-4' />
                <h2 className='font-bold text-lg text-center mb-2'>Sign in with Google</h2>
                <p className="text-center text-gray-600 mb-4">Sign in with Google authentication securely</p>

                <Button
                  disabled={loading}
                  onClick={Login}
                  className='w-full px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700'
                >
                  <FcGoogle className='w-6 h-6 mr-2' /> Sign in with Google
                </Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default Create_trip;
