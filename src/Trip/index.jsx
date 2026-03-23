import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { toast, ToastContainer } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import axios from 'axios';
import { doc, setDoc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader
} from "@/components/ui/dialog";

import { AI_PROMPT, Budget, SelectTravelList } from '@/constants/options';
import { sendTripPrompt } from '@/components/Service/AIModel';
import { db } from '@/components/Service/Firebase';

import { FiMapPin, FiCalendar, FiDollarSign, FiUsers, FiArrowRight, FiLoader, FiSearch, FiCompass } from 'react-icons/fi';
import "react-toastify/dist/ReactToastify.css";

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
    } finally {
      setIsSearchingLocations(false);
    }
  }, []);

  const handleDestinationChange = useCallback((value) => {
    setFormData(prev => ({
      ...prev,
      destination: value,
      locationDetails: value === "" ? null : prev.locationDetails
    }));

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchLocations(value);
    }, 500);
  }, [searchLocations]);

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

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenInfo) => {
      try {
        await getUserProfile(tokenInfo);
      } catch (error) {
        toast.error("Failed to authenticate with Google");
      }
    },
    onError: () => {
      toast.error("Google login failed. Please try again.");
    },
    scope: "profile email"
  });

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
      await generateTrip();
    } catch (error) {
      toast.error("Failed to retrieve user information");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.destination.trim()) {
      toast.warning("Please enter a destination");
      return false;
    }
    if (!formData.days || isNaN(formData.days)) {
      toast.warning("Please enter number of days");
      return false;
    }
    if (!formData.budget) {
      toast.warning("Please select a budget");
      return false;
    }
    if (!formData.people) {
      toast.warning("Please select travelers");
      return false;
    }
    return true;
  };

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

      const result = await sendTripPrompt(finalPrompt);
      const tripData = await result.response.text();
      await saveTrip(tripData);
    } catch (error) {
      console.error("Trip generation error:", error);
      toast.error("Failed to generate trip. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveTrip = async (tripData) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const docId = Date.now().toString();
      const parsedTripData = JSON.parse(tripData);

      await setDoc(doc(db, "AITrips", docId), {
        userChoice: formData,
        tripData: parsedTripData,
        userEmail: user?.email,
        id: docId,
        createdAt: new Date().toISOString(),
        locationDetails: formData.locationDetails
      });

      const savedAt = new Date().toLocaleDateString();
      const savedTrip = {
        id: docId,
        name: formData.locationDetails?.name || formData.destination,
        destination: formData.destination,
        savedAt,
        itinerary: parsedTripData?.itinerary || parsedTripData?.travelPlan?.itinerary || []
      };

      const existingTrips = JSON.parse(localStorage.getItem('savedTrips') || '[]');
      localStorage.setItem('savedTrips', JSON.stringify([savedTrip, ...existingTrips]));

      navigate('/my-trips');
    } catch (error) {
      console.error("Failed to save trip:", error);
      toast.error("Failed to save trip data");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <ToastContainer position="top-center" autoClose={4000} />

      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="container-app pt-20 pb-12 relative">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 m-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-6">
            <FiCompass className="text-indigo-600" />
            <span className="text-sm font-medium text-indigo-700">AI Trip Planner</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Plan Your Perfect Trip
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Tell us about your dream destination and let AI create a personalized itinerary
          </p>
        </div>

        {/* Main Form Card */}
        <div className="max-w-4xl mx-auto">
          <div className="card p-8 md:p-10 animate-slide-up">

            {/* Destination & Days */}
            <div className="grid gap-6 md:grid-cols-2 mb-8">
              {/* Destination Input */}
              <div className="relative">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <FiMapPin className="inline mr-2 text-indigo-600" />
                  Where to?
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="input-modern pl-11"
                    placeholder=" Search destinations..."
                    value={formData.destination}
                    onChange={(e) => handleDestinationChange(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  />
                  {/* <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    {isSearchingLocations ? (
                      <FiLoader className="animate-spin" size={20} />
                    ) : (
                      <FiSearch size={20} />
                    )}
                  </div> */}
                </div>

                {/* Location Suggestions */}
                {showSuggestions && locationSuggestions.length > 0 && (
                  <div className="absolute z-20 w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
                    {locationSuggestions.map((place) => (
                      <button
                        key={place.place_id}
                        className="w-full p-4 text-left hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors"
                        onMouseDown={() => selectLocation(place)}
                      >
                        <div className="font-medium text-slate-900 flex items-center gap-2">
                          <FiMapPin className="text-indigo-500" size={14} />
                          {place.display_name.split(',').slice(0, 2).join(',')}
                        </div>
                        <div className="text-sm text-slate-500 ml-5 truncate">
                          {place.display_name}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {formData.locationDetails && (
                  <div className="mt-2 text-sm text-indigo-600 flex items-center gap-1">
                    <FiMapPin size={12} />
                    {formData.locationDetails.name}, {formData.locationDetails.country}
                  </div>
                )}
              </div>

              {/* Days Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <FiCalendar className="inline mr-2 text-indigo-600" />
                  How many days?
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  className="input-modern"
                  placeholder="e.g., 5"
                  value={formData.days}
                  onChange={(e) => setFormData(prev => ({ ...prev, days: e.target.value }))}
                />
              </div>
            </div>

            {/* Budget Selection */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-slate-700 mb-4">
                <FiDollarSign className="inline mr-2 text-indigo-600" />
                What's your budget?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Budget.map((item) => (
                  <button
                    key={item.title}
                    onClick={() => setFormData(prev => ({ ...prev, budget: item.title }))}
                    className={`selection-card p-5 rounded-xl text-left transition-all ${
                      formData.budget === item.title ? 'selected' : ''
                    }`}
                  >
                    {item.icon && (
                      <img src={item.icon} alt={item.title} className="w-10 h-10 mb-3" />
                    )}
                    <h3 className="font-semibold text-slate-900">{item.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Travelers Selection */}
            <div className="mb-10">
              <label className="block text-sm font-semibold text-slate-700 mb-4">
                <FiUsers className="inline mr-2 text-indigo-600" />
                Who's traveling?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {SelectTravelList.map((item) => (
                  <button
                    key={item.people}
                    onClick={() => setFormData(prev => ({ ...prev, people: item.people }))}
                    className={`selection-card p-4 rounded-xl text-center transition-all ${
                      formData.people === item.people ? 'selected' : ''
                    }`}
                  >
                    {item.icon && (
                      <img src={item.icon} alt={item.title} className="w-10 h-10 mx-auto mb-2" />
                    )}
                    <h3 className="font-semibold text-slate-900 text-sm">{item.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{item.people} {Number(item.people) === 1 ? 'person' : 'people'}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={generateTrip}
              disabled={isLoading}
              className={`w-full btn-primary py-4 text-lg flex items-center justify-center gap-3 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <FiLoader className="animate-spin" />
                  Creating Your Trip...
                </>
              ) : (
                <>
                  Generate My Itinerary
                  <FiArrowRight />
                </>
              )}
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mt-8 text-center animate-fade-in stagger-2">
            <div className="p-4">
              <div className="text-2xl mb-2">🎯</div>
              <p className="text-sm text-slate-600">Personalized Plans</p>
            </div>
            <div className="p-4">
              <div className="text-2xl mb-2">⚡</div>
              <p className="text-sm text-slate-600">Instant Results</p>
            </div>
            <div className="p-4">
              <div className="text-2xl mb-2">🆓</div>
              <p className="text-sm text-slate-600">100% Free</p>
            </div>
          </div>
        </div>
      </div>

      {/* Login Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl border-0">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-8 text-center">
            <div className="w-20 h-20 mx-auto bg-white rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <FiCompass className="text-4xl text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-white">Sign In to Continue</h2>
            <p className="text-indigo-100 mt-2">Save and access your travel plans</p>
          </div>

          <DialogHeader className="p-8">
            <DialogDescription asChild>
              <div>
                <Button
                  onClick={googleLogin}
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center gap-3 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all ${
                    isLoading ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                >
                  <FcGoogle className="text-2xl" />
                  {isLoading ? 'Signing in...' : 'Continue with Google'}
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
