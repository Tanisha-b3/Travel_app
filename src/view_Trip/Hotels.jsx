import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiStar, FiMapPin, FiDollarSign, FiExternalLink, FiHeart } from "react-icons/fi";
import defaultHotelImage from '../assets/road.png';
import road from '../assets/road.png';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Hotels = ({ tripData }) => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [sortOption, setSortOption] = useState('recommended');
  const [hotelImages, setHotelImages] = useState({});

  useEffect(() => {
    // Simulate loading delay for better UX
    const timer = setTimeout(() => {
      const hotelsData = tripData?.tripData?.hotels || [];
      setHotels(hotelsData);
      setLoading(false);
      
      // Load favorites from localStorage
      const savedFavorites = JSON.parse(localStorage.getItem('hotelFavorites')) || [];
      setFavorites(savedFavorites);

      // Fetch images for hotels
      fetchHotelImages(hotelsData);
    }, 800);

    return () => clearTimeout(timer);
  }, [tripData]);

  const fetchHotelImages = async (hotelsData) => {
    const images = {};
    
    try {
      await Promise.all(
        hotelsData.map(async (hotel, index) => {
          const hotelName = hotel["Hotel Name"];
          if (!hotelName) return;
          
          try {
            const response = await fetch(
              `https://api.unsplash.com/search/photos?query=${encodeURIComponent(hotelName + " hotel")}&client_id=import.meta.env.VITE_key&per_page=1`
            );
            const data = await response.json();
            if (data.results && data.results.length > 0) {
              images[hotelName] = data.results[0].urls.regular;
            }
          } catch (error) {
            console.error("Error fetching image for", hotelName, error);
          }
        })
      );
      
      setHotelImages(images);
    } catch (error) {
      console.error("Error fetching hotel images:", error);
    }
  };

  useEffect(() => {
    // Save favorites to localStorage when they change
    localStorage.setItem('hotelFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (hotelId) => {
    setFavorites(prev => 
      prev.includes(hotelId) 
        ? prev.filter(id => id !== hotelId) 
        : [...prev, hotelId]
    );
  };

  const sortedHotels = [...hotels].sort((a, b) => {
    switch(sortOption) {
      case 'price-low':
        return parsePrice(a.Price) - parsePrice(b.Price);
      case 'price-high':
        return parsePrice(b.Price) - parsePrice(a.Price);
      case 'rating':
        return parseRating(b.Rating) - parseRating(a.Rating);
      default:
        return 0; // Default order
    }
  });

  const parsePrice = (price) => {
    if (!price) return Infinity;
    // Handle different price formats: "$100", "100 USD", "From $120", etc.
    const numericValue = parseFloat(price.replace(/[^0-9.]/g, ''));
    return isNaN(numericValue) ? Infinity : numericValue;
  };

  const formatPrice = (price) => {
    if (!price) return "Price not available";
    // Extract currency symbol if present
    const currencySymbol = price.match(/[^\d.,\s]/)?.[0] || '$';
    const numericValue = parsePrice(price);
    
    if (isNaN(numericValue)) {
      return price; // Return original if we can't parse
    }
    
    return `${currencySymbol}${numericValue.toFixed(0)}`;
  };

  const parseRating = (rating) => {
    if (!rating) return 0;
    return parseFloat(rating.split(' ')[0]);
  };

  const renderStars = (rating) => {
    const num = parseRating(rating);
    if (!num) return null;
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <FiStar 
            key={i}
            className={`${i < num ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            size={16}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({num})</span>
      </div>
    );
  };

  const getHotelImage = (hotelName) => {
    return hotelImages[hotelName] || defaultHotelImage;
  };

  return (
    <div className="px-4 py-8 bg-gradient-to-b">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="font-bold text-3xl md:text-4xl text-blue-900 mb-2">
            Hotel Recommendations
          </h2>
          <p className="text-lg text-blue-600 max-w-2xl mx-auto">
            Find the perfect stay for your trip
          </p>
        </div>

        {/* Sorting Controls */}
        <div className="flex justify-between items-center mb-8 px-2">
          <div className="text-sm text-gray-500">
            Showing {hotels.length} {hotels.length === 1 ? 'hotel' : 'hotels'}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select 
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="recommended">Recommended</option>
              <option value="price-low">Price (Low to High)</option>
              <option value="price-high">Price (High to Low)</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        {/* Hotel Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <Skeleton height={180} />
                <div className="p-4">
                  <Skeleton count={2} />
                  <Skeleton width={100} />
                </div>
              </div>
            ))}
          </div>
        ) : hotels.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedHotels.map((hotel, index) => {
              const hotelId = hotel["Hotel Name"] + index; // Create unique ID
              const isFavorite = favorites.includes(hotelId);
              const priceDisplay = hotel.price;
              
              return (
                <div 
                  key={index}
                  className="relative bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
                >
                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(hotelId);
                    }}
                    className={`absolute top-3 right-3 z-10 p-2 rounded-full ${isFavorite ? 'bg-red-100 text-red-500' : 'bg-white/90 text-gray-400'} hover:bg-red-100 hover:text-red-500 transition-colors`}
                  >
                    <FiHeart className={isFavorite ? 'fill-current' : ''} />
                  </button>

                  <Link
                    to={`https://www.google.com/travel/hotels?q=${encodeURIComponent(hotel["Hotel Name"] + ' ' + hotel["Hotel Address"])}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {/* Hotel Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={getHotelImage(hotel["Hotel Name"])}
                        alt={hotel["Hotel Name"]}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        onError={(e) => {
                          e.target.src = defaultHotelImage;
                        }}
                      />
                      {/* <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        {hotel.Price && (
                          <div className="text-white font-bold text-xl">
                            {priceDisplay}
                            <span className="text-sm font-normal ml-1">per night</span>
                          </div>
                        )}
                      </div> */}
                    </div>

                    {/* Hotel Info */}
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
                          {hotel["Hotel Name"] || "Unnamed Hotel"}
                        </h3>
                      </div>

                      <div className="flex items-center text-gray-500 mb-3">
                        <FiMapPin className="mr-1" size={14} />
                        <p className="text-sm line-clamp-1">
                          {hotel["Hotel Address"] || "No address available"}
                        </p>
                      </div>

                      {hotel.Rating && renderStars(hotel.Rating)}

                      <div className="mt-4 flex justify-between items-center">
                        {hotel["Review Count"] && (
                          <p className="text-sm text-gray-500">
                            {hotel["Review Count"]} reviews
                          </p>
                        )}
                        <div className="flex items-center text-blue-600 text-sm font-medium">
                          View Details <FiExternalLink className="ml-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <img 
              src={road} 
              alt="No hotels found" 
              className="mx-auto h-40 opacity-50 mb-6"
            />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No hotel recommendations available
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              We couldn't find any hotel recommendations for your trip. Try adjusting your search criteria.
            </p>
          </div>
        )}

        {/* Map View Option */}
        {hotels.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              to={`https://www.google.com/maps/search/${encodeURIComponent(hotels.map(h => h["Hotel Name"]).join('|'))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
            >
              View All Hotels on Map
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hotels;