import { useEffect, useState } from "react";

const MyTrip = () => {
  const [savedTrips, setSavedTrips] = useState([]);

  useEffect(() => {
    const trips = JSON.parse(localStorage.getItem('savedTrips')) || [];
    setSavedTrips(trips);
  }, []);

  const handleDeleteTrip = (id) => {
    const updatedTrips = savedTrips.filter(trip => trip.id !== id);
    setSavedTrips(updatedTrips);
    localStorage.setItem('savedTrips', JSON.stringify(updatedTrips));
  };

  if (savedTrips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="max-w-md space-y-4">
          <h3 className="text-2xl font-bold text-gray-800">No Saved Trips</h3>
          <p className="text-gray-600">
            Your saved trips will appear here when you create them.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">My Saved Trips</h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {savedTrips.map(trip => (
          <div 
            key={trip.id} 
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800 truncate max-w-[70%]">
                  {trip.name}
                </h3>
                <button 
                  onClick={() => handleDeleteTrip(trip.id)}
                  className="px-3 py-1 bg-red-50 text-red-600 rounded-md text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  Delete
                </button>
              </div>
              
              <div className="flex flex-col space-y-2 text-sm text-gray-600 mb-4">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {trip.destination}
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Saved: {trip.savedAt}
                </span>
              </div>
              
              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-medium text-gray-700 mb-3">Itinerary:</h4>
                <div className="space-y-4">
                  {trip.itinerary.map((day, dayIndex) => (
                    <div key={dayIndex} className="bg-gray-50 rounded-lg p-3">
                      <h5 className="font-medium text-blue-600 mb-2">
                        Day {dayIndex + 1}
                      </h5>
                      {day.Places?.length > 0 ? (
                        <div className="space-y-3">
                          {day.Places.map((place, placeIndex) => (
                            <div key={placeIndex} className="text-sm">
                              <p className="font-medium text-gray-800">
                                {place['Place Name'] || "Unnamed Place"}
                              </p>
                              {place['Place Details'] && (
                                <p className="text-gray-600 mt-1 line-clamp-2">
                                  {place['Place Details']}
                                </p>
                              )}
                              <div className="mt-2 space-y-1 text-xs text-gray-500">
                                {place['Best Time to Visit'] && (
                                  <p className="flex items-center">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Best time: {place['Best Time to Visit']}
                                  </p>
                                )}
                                {place['Time to Travel'] && (
                                  <p className="flex items-center">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Travel time: {place['Time to Travel']}
                                  </p>
                                )}
                                {place['Ticket Pricing'] && (
                                  <p className="flex items-center">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Price: {place['Ticket Pricing']}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500 italic">
                          No places planned for this day
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTrip;