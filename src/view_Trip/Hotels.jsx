import { Link } from "react-router-dom";
import road from '../assets/road.png';

const Hotels = ({ tripData }) => {
  const hotel = tripData?.tripData?.hotels || []; // Default to empty array if no hotels available

  return (
    <div className="px-6 py-8 bg-gray-100 min-h-screen">
      <h2 className="font-semibold text-2xl text-blue-800 mb-6 text-center">Hotel Recommendations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotel.length > 0 ? (
          hotel.map((item, index) => (
            <Link
              key={index}
              to={`https://serpapi.com/search?engine=google_hotels&q=${encodeURIComponent(item["Hotel Name"])}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="transform transition-all duration-200 border border-gray-300 rounded-lg p-4 bg-white shadow-sm hover:shadow-md hover:scale-105">
                <img
                  src={road} // Fallback if no image
                  alt={item["Hotel Name"]}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h3 className="font-medium text-lg text-gray-800">{item["Hotel Name"] || "Unnamed Hotel"}</h3>
                <p className="text-sm text-gray-600">{item["Hotel Address"] || "No address available"}</p>
                <p className="text-sm text-gray-700 font-semibold">{item["Price"] || "Price not available"}</p>
                <p className="text-sm text-yellow-500">{item["Rating"] || "No rating"}</p>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-500">No hotel recommendations available.</p>
        )}
      </div>
    </div>
  );
};

export default Hotels;
