import { useState, useEffect } from "react";
import { FiClock, FiDollarSign, FiMapPin, FiChevronDown, FiSave, FiCheck, FiExternalLink } from "react-icons/fi";
import defaultImage from "../assets/road.png";

const PlacesVisit = ({ tripData }) => {
  const [tripName, setTripName] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [expandedDays, setExpandedDays] = useState([0]);
  const [placeImages, setPlaceImages] = useState({});

  const itinerary = tripData?.tripData?.itinerary;
  const destination = tripData?.userChoice?.destination || "Your Adventure";

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
                `https://api.unsplash.com/search/photos?query=${encodeURIComponent(placeName)}&client_id=9nh7S4FHl0pnJ0tjKObRksK3YOSPp5pRR3jeSayKOzw&per_page=1`
              );
              const data = await response.json();
              if (data.results && data.results.length > 0) {
                newPlaceImages[placeName] = data.results[0].urls.regular;
              }
            } catch (error) {
              console.error("Error fetching image for", placeName);
            }
          }
        }
      }

      setPlaceImages(newPlaceImages);
    };

    fetchPlaceImages();
  }, [itinerary]);

  const getPlaceImage = (placeName) => placeImages[placeName] || defaultImage;

  const handleSaveTrip = () => {
    if (!tripName.trim() || !itinerary) return;

    const newTrip = {
      id: Date.now(),
      name: tripName,
      itinerary: [...itinerary],
      destination,
      savedAt: new Date().toLocaleString(),
    };

    const existingTrips = JSON.parse(localStorage.getItem('savedTrips')) || [];
    const updatedTrips = existingTrips.filter(trip => trip.name !== tripName);
    localStorage.setItem('savedTrips', JSON.stringify([...updatedTrips, newTrip]));

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const toggleDay = (dayIndex) => {
    setExpandedDays(prev =>
      prev.includes(dayIndex)
        ? prev.filter(d => d !== dayIndex)
        : [...prev, dayIndex]
    );
  };

  if (!itinerary || itinerary.length === 0) return null;

  return (
    <section className="py-12 bg-white">
      <div className="container-app">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Your Itinerary
            </h2>
            <p className="text-slate-500 mt-1">
              {itinerary.length} days of adventure planned
            </p>
          </div>

          {/* Save Trip */}
          <div className="flex gap-3">
            <input
              type="text"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              placeholder="Name your trip..."
              className="input-modern py-2.5 px-4 text-sm w-48"
              maxLength={30}
            />
            <button
              onClick={handleSaveTrip}
              disabled={!tripName.trim()}
              className={`px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all ${
                isSaved
                  ? 'bg-green-500 text-white'
                  : 'btn-primary disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {isSaved ? <FiCheck /> : <FiSave />}
              {isSaved ? 'Saved!' : 'Save'}
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          {itinerary.map((dayData, dayIndex) => {
            const isExpanded = expandedDays.includes(dayIndex);
            const places = dayData.Places || [];

            return (
              <div
                key={dayIndex}
                className="card overflow-hidden animate-fade-in"
                style={{ animationDelay: `${dayIndex * 0.1}s` }}
              >
                {/* Day Header */}
                <button
                  onClick={() => toggleDay(dayIndex)}
                  className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">
                      {dayIndex + 1}
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-lg text-slate-900">
                        Day {dayIndex + 1}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {places.length} {places.length === 1 ? 'place' : 'places'} to visit
                      </p>
                    </div>
                  </div>
                  <FiChevronDown
                    size={20}
                    className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Places */}
                {isExpanded && places.length > 0 && (
                  <div className="border-t border-slate-100 p-5">
                    <div className="relative">
                      {/* Timeline line */}
                      {places.length > 1 && (
                        <div className="absolute left-[23px] top-12 bottom-12 w-0.5 bg-gradient-to-b from-indigo-200 to-transparent"></div>
                      )}

                      <div className="space-y-6">
                        {places.map((place, placeIndex) => (
                          <div
                            key={placeIndex}
                            className="flex gap-5 animate-slide-in"
                            style={{ animationDelay: `${placeIndex * 0.1}s` }}
                          >
                            {/* Timeline dot */}
                            <div className="relative shrink-0">
                              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold border-2 border-white shadow-sm">
                                {placeIndex + 1}
                              </div>
                            </div>

                            {/* Place Card */}
                            <div className="flex-1 bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors">
                              <div className="flex flex-col md:flex-row gap-4">
                                {/* Image */}
                                <div className="w-full md:w-40 h-32 rounded-lg overflow-hidden shrink-0">
                                  <img
                                    src={getPlaceImage(place['Place Name'])}
                                    alt={place['Place Name'] || "Place"}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.src = defaultImage }}
                                  />
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                  <div className="flex items-start justify-between gap-2">
                                    <h4 className="font-semibold text-lg text-slate-900">
                                      {place['Place Name'] || "Unnamed Place"}
                                    </h4>
                                    <a
                                      href={`https://www.google.com/maps/search/${encodeURIComponent(place['Place Name'] || '')}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="shrink-0 w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                    >
                                      <FiExternalLink size={14} />
                                    </a>
                                  </div>

                                  {place['Place Details'] && (
                                    <p className="text-slate-600 text-sm mt-2 line-clamp-2">
                                      {place['Place Details']}
                                    </p>
                                  )}

                                  {/* Meta Info */}
                                  <div className="flex flex-wrap gap-3 mt-3">
                                    {place['Time To Travel'] && (
                                      <span className="badge badge-primary">
                                        <FiClock size={12} />
                                        {place['Time To Travel']}
                                      </span>
                                    )}
                                    {place['Ticket Pricing'] && (
                                      <span className="badge badge-success">
                                        <FiDollarSign size={12} />
                                        {place['Ticket Pricing']}
                                      </span>
                                    )}
                                    {place['Best Time To Visit'] && (
                                      <span className="badge badge-warning">
                                        <FiMapPin size={12} />
                                        {place['Best Time To Visit']}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* No places message */}
                {isExpanded && places.length === 0 && (
                  <div className="border-t border-slate-100 p-8 text-center">
                    <p className="text-slate-500">No places planned for this day</p>
                    <p className="text-sm text-slate-400 mt-1">Perfect for spontaneous exploration!</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PlacesVisit;
