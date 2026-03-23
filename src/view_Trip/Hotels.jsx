import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiStar, FiMapPin, FiHeart, FiExternalLink } from "react-icons/fi";
import defaultHotelImage from '../assets/road.png';

const Hotels = ({ tripData }) => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [hotelImages, setHotelImages] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      const hotelsData = tripData?.tripData?.hotels || [];
      setHotels(hotelsData);
      setLoading(false);
      fetchHotelImages(hotelsData);

      const savedFavorites = JSON.parse(localStorage.getItem('hotelFavorites')) || [];
      setFavorites(savedFavorites);
    }, 500);

    return () => clearTimeout(timer);
  }, [tripData]);

  const fetchHotelImages = async (hotelsData) => {
    const images = {};

    try {
      await Promise.all(
        hotelsData.map(async (hotel) => {
          const hotelName = hotel["Hotel Name"];
          if (!hotelName) return;

          try {
            const response = await fetch(
              `https://api.unsplash.com/search/photos?query=${encodeURIComponent(hotelName + " hotel room")}&client_id=9nh7S4FHl0pnJ0tjKObRksK3YOSPp5pRR3jeSayKOzw&per_page=1`
            );
            const data = await response.json();
            if (data.results && data.results.length > 0) {
              images[hotelName] = data.results[0].urls.regular;
            }
          } catch (error) {
            console.error("Error fetching image for", hotelName);
          }
        })
      );
      setHotelImages(images);
    } catch (error) {
      console.error("Error fetching hotel images:", error);
    }
  };

  const toggleFavorite = (hotelId) => {
    const newFavorites = favorites.includes(hotelId)
      ? favorites.filter(id => id !== hotelId)
      : [...favorites, hotelId];
    setFavorites(newFavorites);
    localStorage.setItem('hotelFavorites', JSON.stringify(newFavorites));
  };

  const parseRating = (rating) => {
    if (!rating) return 0;
    if (typeof rating === 'number') return rating;
    return parseFloat(String(rating).split(' ')[0]) || 0;
  };

  const renderStars = (rating) => {
    const num = Math.round(parseRating(rating));
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <FiStar
            key={i}
            size={14}
            className={i < num ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}
          />
        ))}
        <span className="text-sm text-slate-500 ml-1">({parseRating(rating)})</span>
      </div>
    );
  };

  if (hotels.length === 0 && !loading) return null;

  return (
    <section className="py-12">
      <div className="container-app">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Recommended Hotels
            </h2>
            <p className="text-slate-500 mt-1">
              {hotels.length} {hotels.length === 1 ? 'option' : 'options'} for your stay
            </p>
          </div>
        </div>

        {/* Hotels Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card overflow-hidden">
                <div className="h-48 bg-slate-200 animate-pulse"></div>
                <div className="p-5">
                  <div className="h-5 bg-slate-200 rounded animate-pulse mb-3 w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded animate-pulse w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel, index) => {
              const hotelId = (hotel["Hotel Name"] || 'hotel') + index;
              const isFavorite = favorites.includes(hotelId);
              const hotelName = hotel["Hotel Name"] || "Hotel";
              const hotelAddress = hotel["Hotel Address"] || "";
              const hotelImage = hotelImages[hotelName] || defaultHotelImage;

              return (
                <div
                  key={index}
                  className="card overflow-hidden group animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={hotelImage}
                      alt={hotelName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.src = defaultHotelImage }}
                    />

                    {/* Price Badge */}
                    {hotel.Price && (
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm">
                        <span className="font-bold text-slate-900">{hotel.Price}</span>
                        <span className="text-xs text-slate-500">/night</span>
                      </div>
                    )}

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(hotelId);
                      }}
                      className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isFavorite
                          ? 'bg-red-500 text-white'
                          : 'bg-white/90 text-slate-600 hover:bg-white'
                      }`}
                    >
                      <FiHeart className={isFavorite ? 'fill-current' : ''} size={18} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-semibold text-lg text-slate-900 mb-2 line-clamp-1">
                      {hotelName}
                    </h3>

                    {hotelAddress && (
                      <div className="flex items-start gap-2 text-slate-500 text-sm mb-3">
                        <FiMapPin size={14} className="mt-0.5 shrink-0" />
                        <span className="line-clamp-1">{hotelAddress}</span>
                      </div>
                    )}

                    {hotel.Rating && renderStars(hotel.Rating)}

                    {hotel.Description && (
                      <p className="text-sm text-slate-600 mt-3 line-clamp-2">
                        {hotel.Description}
                      </p>
                    )}

                    {/* View Button */}
                    <Link
                      to={`https://www.google.com/travel/hotels?q=${encodeURIComponent(hotelName + ' ' + hotelAddress)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 w-full btn-secondary py-2.5 text-sm flex items-center justify-center gap-2"
                    >
                      View Details
                      <FiExternalLink size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Hotels;
