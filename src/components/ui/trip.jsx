import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMapPin, FiCalendar, FiTrash2, FiArrowRight, FiMap } from "react-icons/fi";

const MyTrip = () => {
const [savedTrips, setSavedTrips] = useState([]);
const navigate = useNavigate();

useEffect(() => {
try {
const trips = JSON.parse(localStorage.getItem("savedTrips")) || [];
setSavedTrips(trips);
} catch (err) {
console.error("Error parsing trips:", err);
setSavedTrips([]);
}
}, []);

const handleDeleteTrip = (id) => {
const confirmDelete = window.confirm("Are you sure you want to delete this trip?");
if (!confirmDelete) return;


const updatedTrips = savedTrips.filter((trip) => trip.id !== id);
setSavedTrips(updatedTrips);
localStorage.setItem("savedTrips", JSON.stringify(updatedTrips));


};

const getGradientClass = (index) => {
const gradients = [
"from-blue-500 to-purple-600",
"from-purple-500 to-pink-600",
"from-orange-500 to-red-600",
"from-green-500 to-teal-600",
"from-indigo-500 to-blue-600",
"from-rose-500 to-orange-600",
];
return gradients[index % gradients.length];
};

const countPlaces = (itinerary = []) => {
return itinerary.reduce((total, day) => total + (day?.Places?.length || 0), 0);
};

if (!savedTrips.length) {
return ( <div className="min-h-[60vh] flex flex-col items-center justify-center p-6"> <FiMap className="w-16 h-16 text-indigo-400 opacity-50 mb-4" /> <h3 className="text-3xl font-bold mb-2">No Trips Yet</h3> <p className="text-slate-600 text-center">
Start planning your first trip and it will appear here ✈️ </p> </div>
);
}

return ( <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-12"> <div className="container-app px-4">
    {/* Header */}
    <div className="mb-10">
      <h1 className="text-4xl font-bold flex items-center gap-2">
        <FiMap className="text-indigo-600" />
        My Trips
      </h1>
      <p className="text-slate-600 mt-1">
        {savedTrips.length} trip{savedTrips.length > 1 && "s"} saved
      </p>
    </div>

    {/* Grid */}
    <div className="flex gap-6 overflow-x-auto pb-4">
      {savedTrips.map((trip, index) => (
        <div
          key={trip.id}
          className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition w-80 flex-shrink-0"
        >
          
          {/* Header */}
          <div className={`h-24 bg-gradient-to-br ${getGradientClass(index)} rounded-t-2xl`} />

          <div className="p-5">
            
            {/* Title */}
            <h3 className="text-lg font-bold mb-1">{trip.name}</h3>

            {/* Info */}
            <div className="flex justify-between text-sm text-slate-600 mb-4">
              <span className="flex items-center gap-1">
                <FiMapPin /> {trip.destination}
              </span>
              <span className="flex items-center gap-1">
                <FiCalendar /> {trip.itinerary?.length || 0}d
              </span>
            </div>

            {/* Stats */}
            <p className="text-sm text-slate-500 mb-4">
              {countPlaces(trip.itinerary)} places • {trip.savedAt}
            </p>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/view-trip/${trip.id}`)}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-lg flex items-center justify-center gap-1"
              >
                View <FiArrowRight />
              </button>

              <button
                onClick={() => handleDeleteTrip(trip.id)}
                className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg flex items-center justify-center gap-1"
              >
                <FiTrash2 /> Delete
              </button>
            </div>

          </div>
        </div>
      ))}
    </div>
  </div>
</div>


);
};

export default MyTrip;
