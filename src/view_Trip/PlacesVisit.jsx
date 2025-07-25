import { useState, useEffect } from "react";
import { FiClock, FiDollarSign, FiMapPin, FiCalendar, FiSave, FiCheck } from "react-icons/fi";
import defaultImage from "../assets/road.png";

const PlacesVisit = ({ tripData }) => {
  const [tripName, setTripName] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDay, setActiveDay] = useState(null);
  const [placeImages, setPlaceImages] = useState({});
  const itinerary = tripData?.tripData?.itinerary;
  const destination = tripData?.tripData?.destination || "Your Adventure";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch images for each place
  useEffect(() => {
    if (!itinerary) return;

    const fetchPlaceImages = async () => {
      const newPlaceImages = {};
      
      for (const day of itinerary) {
        if (!day.Places) continue;
        
        for (const place of day.Places) {
          const placeName = place['Place Name'];
          if (placeName && !newPlaceImages[placeName]) {
            try {
              const response = await fetch(
                `https://api.unsplash.com/search/photos?query=${encodeURIComponent(placeName)}&client_id=import.meta.env.VITE_key`
              );
              const data = await response.json();
              if (data.results && data.results.length > 0) {
                newPlaceImages[placeName] = data.results[0].urls.regular;
              }
            } catch (error) {
              console.error("Error fetching image for", placeName, error);
            }
          }
        }
      }
      
      setPlaceImages(newPlaceImages);
    };

    fetchPlaceImages();
  }, [itinerary]);

  const getPlaceImage = (placeName) => {
    return placeImages[placeName] || defaultImage;
  };

  const handleSaveTrip = () => {
    if (!tripName.trim()) {
      alert("Please enter a trip name");
      return;
    }
    
    if (!itinerary || itinerary.length === 0) {
      alert("No itinerary data to save");
      return;
    }
    
    const newTrip = {
      id: Date.now(),
      name: tripName,
      itinerary: [...itinerary],
      destination,
      savedAt: new Date().toLocaleString(),
      image: itinerary[0]?.Places?.[0]?.image || defaultImage
    };
    
    const existingTrips = JSON.parse(localStorage.getItem('savedTrips')) || [];
    const isDuplicate = existingTrips.some(trip => trip.name === tripName);
    
    if (isDuplicate) {
      if (!window.confirm(`A trip named "${tripName}" exists. Overwrite?`)) return;
      const updatedTrips = existingTrips.filter(trip => trip.name !== tripName);
      localStorage.setItem('savedTrips', JSON.stringify([...updatedTrips, newTrip]));
    } else {
      localStorage.setItem('savedTrips', JSON.stringify([...existingTrips, newTrip]));
    }
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const toggleDay = (dayIndex) => {
    setActiveDay(activeDay === dayIndex ? null : dayIndex);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className={`bg-white border-b border-gray-100 transition-shadow duration-300 ${isScrolled ? "shadow-sm" : ""}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
            <h1 className="text-xl font-semibold text-gray-800 flex items-center">
              <FiMapPin className="mr-2 text-gray-500" />
              {destination}
            </h1>
            
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
              <input
                type="text"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                placeholder="Name your adventure"
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200"
                maxLength={30}
              />
              <button
                onClick={handleSaveTrip}
                disabled={!tripName.trim() || !itinerary}
                className={`px-4 py-2 rounded-lg font-medium flex items-center justify-center transition-colors duration-200 ${
                  isSaved
                    ? "bg-green-600 text-white"
                    : "bg-gray-700 text-white hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                }`}
              >
                {isSaved ? (
                  <>
                    <FiCheck className="mr-2" />
                    Saved!
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" />
                    Save Trip
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {itinerary?.length > 0 ? (
          <div className="space-y-5">
            {itinerary.map((dayData, dayIndex) => (
              <div
                key={dayIndex}
                className={`bg-white rounded-lg shadow-xs overflow-hidden transition-all duration-200 ${
                  activeDay === dayIndex ? "ring-1 ring-gray-100" : ""
                }`}
              >
                <div
                  className="p-5 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => toggleDay(dayIndex)}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <h2 className="text-lg font-medium text-gray-800">
                        Day {dayIndex + 1}
                      </h2>
                      {dayData?.date && (
                        <span className="inline-flex items-center text-sm text-gray-500">
                          <FiCalendar className="mr-1.5" />
                          {new Date(dayData.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                    {dayData?.summary && (
                      <p className="mt-1 text-sm text-gray-500">
                        {dayData.summary}
                      </p>
                    )}
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${
                      activeDay === dayIndex ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                {activeDay === dayIndex && (
                  <div className="border-t border-gray-100 p-5">
                    {dayData?.Places?.length > 0 ? (
                      <div className="space-y-5">
                        {dayData.Places.map((place, placeIndex) => (
                          <div
                            key={placeIndex}
                            className="flex flex-col md:flex-row gap-5"
                          >
                            <div className="w-full md:w-1/3 lg:w-1/4">
                              <img
                                src={getPlaceImage(place['Place Name'])}
                                alt={place['Place Name'] || "Travel location"}
                                className="w-full h-48 md:h-40 lg:h-48 object-cover rounded-lg shadow-xs"
                                onError={(e) => {
                                  e.target.src = defaultImage;
                                }}
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                                <h3 className="text-lg font-medium text-gray-800">
                                  {place['Place Name'] || "Unnamed Place"}
                                </h3>
                                {place['Best Time to Visit'] && (
                                  <span className="inline-flex items-center text-sm text-gray-500">
                                    <FiClock className="mr-1.5" />
                                    {place['Best Time to Visit']}
                                  </span>
                                )}
                              </div>

                              {place['Place Details'] && (
                                <p className="text-gray-600 mb-4">
                                  {place['Place Details']}
                                </p>
                              )}

                              <div className="flex flex-wrap gap-4 text-sm">
                                {place['Time to Travel'] && (
                                  <span className="inline-flex items-center text-gray-500">
                                    <FiClock className="mr-1.5" />
                                    {place['Time to Travel']}
                                  </span>
                                )}

                                {place['Ticket Pricing'] && (
                                  <span className="inline-flex items-center text-gray-500">
                                    <FiDollarSign className="mr-1.5" />
                                    {place['Ticket Pricing']}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">
                          No places planned for this day.
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          Perfect opportunity for spontaneous exploration!
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="max-w-md text-center">
              <img
                src={defaultImage}
                alt="No itinerary"
                className="w-full h-48 object-contain opacity-75 mb-6"
              />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Your Adventure Awaits
              </h2>
              <p className="text-gray-500">
                No itinerary found. Start planning your perfect trip!
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-6">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>Your journey begins here • Happy travels!</p>
        </div>
      </footer>
    </div>
  );
};

export default PlacesVisit;