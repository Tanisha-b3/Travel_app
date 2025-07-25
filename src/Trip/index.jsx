import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { toast, ToastContainer } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import axios from 'axios';
import { doc, setDoc } from 'firebase/firestore';

// Components
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader
} from "@/components/ui/dialog";

// Constants and Services
import { AI_PROMPT, Budget } from '@/constants/options';
import { SelectTravelList } from '@/constants/options';
import { chatSession } from '@/components/Service/AIModel';
import { db } from '@/components/Service/Firebase';

// Styles
import "react-toastify/dist/ReactToastify.css";
import './index.css';

function CreateTrip() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchingLocations, setIsSearchingLocations] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [formData, setFormData] = useState({
    destination: "",
    days: "",
    budget: "",
    people: "",
    locationDetails: null
  });
  
  const searchTimeoutRef = useRef(null);
  const navigate = useNavigate();

  // Search locations using OpenStreetMap Nominatim API
  const searchLocations = useCallback(async (query) => {
    if (!query.trim()) {
      setLocationSuggestions([]);
      return;
    }

    setIsSearchingLocations(true);
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`
      );
      
      setLocationSuggestions(response.data);
    } catch (error) {
      console.error("Location search error:", error);
      toast.error("Failed to search locations");
    } finally {
      setIsSearchingLocations(false);
    }
  }, []);

  // Handle destination input changes with debounce
  const handleDestinationChange = useCallback((value) => {
    setFormData(prev => ({
      ...prev,
      destination: value,
      locationDetails: value === "" ? null : prev.locationDetails
    }));

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounce
    searchTimeoutRef.current = setTimeout(() => {
      searchLocations(value);
    }, 500);
  }, [searchLocations]);

  // Select a location from suggestions
  const selectLocation = useCallback((place) => {
    setFormData(prev => ({
      ...prev,
      destination: place.display_name,
      locationDetails: {
        name: place.display_name.split(',')[0],
        address: place.display_name,
        coordinates: {
          lat: parseFloat(place.lat),
          lon: parseFloat(place.lon)
        },
        country: place.address?.country || "",
        city: place.address?.city || place.address?.town || place.address?.village || ""
      }
    }));
    setShowSuggestions(false);
  }, []);

  // Google login handler
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenInfo) => {
      try {
        await getUserProfile(tokenInfo);
      } catch (error) {
        console.error("Google Login Error:", error);
        toast.error("Failed to authenticate with Google");
      }
    },
    onError: (error) => {
      console.error("Google Login Error:", error);
      toast.error("Google login failed. Please try again.");
    },
    scope: "profile email"
  });

  // Fetch user profile after Google login
  const getUserProfile = async (tokenInfo) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        'https://www.googleapis.com/oauth2/v1/userinfo',
        {
          headers: {
            Authorization: `Bearer ${tokenInfo.access_token}`,
            Accept: 'application/json'
          }
        }
      );
      
      localStorage.setItem('user', JSON.stringify(response.data));
      setIsDialogOpen(false);
      await generateTrip(); // Proceed with trip generation after login
    } catch (error) {
      console.error("Failed to fetch Google profile:", error);
      toast.error("Failed to retrieve user information");
    } finally {
      setIsLoading(false);
    }
  };

  // Validate form inputs
  const validateForm = () => {
    if (!formData.destination.trim()) {
      toast.warning("Please enter a destination");
      return false;
    }
    if (!formData.days || isNaN(formData.days)) {
      toast.warning("Please enter a valid number of days");
      return false;
    }
    if (!formData.budget) {
      toast.warning("Please select a budget range");
      return false;
    }
    if (!formData.people) {
      toast.warning("Please select who you're traveling with");
      return false;
    }
    return true;
  };

  // Generate trip itinerary
  const generateTrip = async () => {
    const user = localStorage.getItem('user');
    if (!user) {
      setIsDialogOpen(true);
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      let locationInfo = formData.destination;
      if (formData.locationDetails) {
        locationInfo = `${formData.locationDetails.name}, ${formData.locationDetails.country}`;
      }

      const finalPrompt = AI_PROMPT
        .replace('{location}', locationInfo)
        .replace('{totalDays}', formData.days)
        .replace('{people}', formData.people)
        .replace('{budget}', formData.budget);

      const result = await chatSession.sendMessage(finalPrompt);
      const tripData = await result.response.text();
      await saveTrip(tripData);
    } catch (error) {
      console.error("Trip generation error:", error);
      toast.error("Failed to generate trip. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Save trip to Firestore
  const saveTrip = async (tripData) => {
    setIsLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const docId = Date.now().toString();

      await setDoc(doc(db, "AITrips", docId), {
        userChoice: formData,
        tripData: JSON.parse(tripData),
        userEmail: user?.email,
        id: docId,
        createdAt: new Date().toISOString(),
        locationDetails: formData.locationDetails
      });

      navigate(`/View-Trip/${docId}`);
    } catch (error) {
      console.error("Failed to save trip:", error);
      toast.error("Failed to save trip data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-center" autoClose={5000} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Tell us your Travel preferences <span className="text-green-500">🌴🏕️</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Provide some basic information, and our AI will craft a personalized itinerary just for you.
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Destination and Days */}
          <div className="grid gap-8 md:grid-cols-2 mb-10">
            <div className="relative">
              <label className="block text-xl font-semibold text-gray-800 mb-3">
                Where would you like to go?
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  {isSearchingLocations ? (
                    <AiOutlineLoading3Quarters className="animate-spin text-xl" />
                  ) : (
                    <FaMapMarkerAlt className="text-xl" />
                  )}
                </div>
                <input
                  type="text"
                  className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Paris, France"
                  value={formData.destination}
                  onChange={(e) => handleDestinationChange(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
                {showSuggestions && locationSuggestions.length > 0 && (
                  <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {locationSuggestions.map((place) => (
                      <li
                        key={place.place_id}
                        className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onMouseDown={() => selectLocation(place)}
                      >
                        <div className="font-medium flex items-center">
                          <FaMapMarkerAlt className="mr-2 text-blue-500" />
                          {place.display_name.split(',').slice(0, 2).join(',')}
                        </div>
                        <div className="text-sm text-gray-500 ml-6">
                          {place.display_name.split(',').slice(2).join(',').trim()}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {formData.locationDetails && (
                <div className="mt-2 text-sm text-gray-600 flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-blue-500" />
                  {formData.locationDetails.address}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xl font-semibold text-gray-800 mb-3">
                Trip duration (days)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 7"
                value={formData.days}
                onChange={(e) => setFormData(prev => ({ ...prev, days: e.target.value }))}
              />
            </div>
          </div>

          {/* Budget Selection */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">What's your budget range?</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {Budget.map((item) => (
                <div
                  key={item.title}
                  onClick={() => setFormData(prev => ({ ...prev, budget: item.title }))}
                  className={`p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    formData.budget === item.title
                      ? 'border-blue-500 bg-blue-50 scale-[1.02]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center mb-3">
                    {item.icon && (
                      <img src={item.icon} className="w-12 h-12 mr-3" alt={item.title} />
                    )}
                    <h3 className="font-bold text-lg">{item.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Travel Companions */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Who's joining you?</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {SelectTravelList.map((item) => (
                <div
                  key={item.people}
                  onClick={() => setFormData(prev => ({ ...prev, people: item.people }))}
                  className={`p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    formData.people === item.people
                      ? 'border-blue-500 bg-blue-50 scale-[1.02]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center mb-3">
                    {item.icon && (
                      <img src={item.icon} className="w-12 h-12 mr-3" alt={item.title} />
                    )}
                    <h3 className="font-bold text-lg">{item.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex justify-end mt-8">
            <Button
              onClick={generateTrip}
              disabled={isLoading}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg shadow-md hover:from-indigo-700 hover:to-blue-600 transition-all duration-300 flex items-center"
            >
              {isLoading ? (
                <>
                  <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                'Create My Perfect Trip'
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Login Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogDescription>
              <div className="text-center">
                <img src="/ex.png" className="h-20 mx-auto mb-4" alt="Travel logo" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign In Required</h2>
                <p className="text-gray-600 mb-6">
                  Please sign in with Google to save and access your travel plans.
                </p>
                
                <Button
                  onClick={googleLogin}
                  disabled={isLoading}
                  className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center"
                >
                  <FcGoogle className="text-xl mr-3" />
                  Continue with Google
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;