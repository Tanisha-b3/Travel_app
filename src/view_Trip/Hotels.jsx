import road from "../assets/road.png";
import { Link } from "react-router-dom";

const Hotels = ({ tripData }) => {
  const hotel = tripData?.tripData?.hotels; // Access hotels from tripData

  console.log("Hotels Data:", hotel); // Log hotels data

  return (
    <div className="px-8 py-10 bg-gray-100 min-h-screen">
      <h2 className="font-bold text-3xl text-blue-900 mb-8">Hotel Recommendations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {hotel && hotel.length > 0 ? (
          hotel.map((item, index) => (
            <Link
              key={index}
              to={`https://serpapi.com/search?engine=google_hotels&q=${item.HotelName}`} // Link to hotel search
              target="_blank" // Open in a new tab
              rel="noopener noreferrer" // Security measure
            >
              <div className="transform hover:scale-110 transition-all duration-300 border border-gray-300 rounded-2xl p-6 bg-white shadow-xl hover:shadow-2xl">
                <img
                  src={road}
                  alt="Hotel"
                  className="w-full h-52 object-cover rounded-2xl mb-4"
                />
                <div className="space-y-3">
                  <h3 className="font-semibold text-xl text-gray-800">{item.HotelName}</h3>
                  <p className="text-base text-gray-600 flex items-center">
                    <span role="img" aria-label="location" className="mr-2 text-lg">
                      📍
                    </span>
                    {item["Hotel address"]}
                  </p>
                  <p className="text-base text-gray-700 font-semibold">💰 {item.Price}</p>
                  <p className="text-base text-yellow-500 flex items-center font-semibold">
                    <span role="img" aria-label="star" className="mr-2 text-lg">
                      ⭐
                    </span>
                    {item.rating}
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500">No hotel recommendations available.</p> // Message for no hotels
        )}
      </div>
    </div>
  );
};

export default Hotels;
