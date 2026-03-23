import { useState, useEffect } from 'react';
import { FiCalendar, FiDollarSign, FiUsers, FiShare2, FiHeart, FiMapPin } from 'react-icons/fi';
import road from '../assets/road.png';

const Info = ({ tripData }) => {
  const [destinationImage, setDestinationImage] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    if (tripData?.userChoice?.destination) {
      fetchDestinationImage(tripData.userChoice.destination);
    }
  }, [tripData]);

  const fetchDestinationImage = async (query) => {
    try {
      // Try Unsplash first
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query + " travel landscape")}&client_id=9nh7S4FHl0pnJ0tjKObRksK3YOSPp5pRR3jeSayKOzw&per_page=1&orientation=landscape`
      );
      const data = await response.json();
      if (data.results && data.results[0]) {
        setDestinationImage(data.results[0].urls.regular);
      }
    } catch (error) {
      console.error("Error fetching image:", error);
    } finally {
      setImageLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `Trip to ${tripData?.userChoice?.destination}`,
        text: `Check out my ${tripData?.userChoice?.days}-day trip plan!`,
        url: window.location.href
      });
    } catch (error) {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (!tripData) return null;

  const { userChoice } = tripData;
  const destinationName = userChoice?.locationDetails?.name || userChoice?.destination?.split(',')[0] || 'Your Destination';

  return (
    <div className="relative">
      {/* Hero Image */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        {imageLoading && (
          <div className="absolute inset-0 bg-slate-200 animate-pulse"></div>
        )}
        <img
          src={destinationImage || road}
          alt={`${destinationName} landscape`}
          className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setImageLoading(false)}
          onError={() => setImageLoading(false)}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

        {/* Action Buttons */}
        <div className="absolute top-6 right-6 flex gap-3">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isLiked ? 'bg-red-500 text-white' : 'bg-white/90 text-slate-700 hover:bg-white'
            }`}
          >
            <FiHeart className={isLiked ? 'fill-current' : ''} size={20} />
          </button>
          <button
            onClick={handleShare}
            className="w-12 h-12 rounded-full bg-white/90 text-slate-700 hover:bg-white flex items-center justify-center transition-all"
          >
            <FiShare2 size={20} />
          </button>
        </div>

        {/* Destination Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="container-app">
            <div className="flex items-center gap-2 text-white/80 mb-2">
              <FiMapPin size={16} />
              <span className="text-sm font-medium">{userChoice?.destination}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              {destinationName}
            </h1>

            {/* Trip Info Badges */}
            <div className="flex flex-wrap gap-3">
              <div className="badge bg-white/20 backdrop-blur-sm text-white border border-white/20">
                <FiCalendar size={16} />
                {userChoice?.days} {Number(userChoice?.days) === 1 ? 'Day' : 'Days'}
              </div>
              <div className="badge bg-white/20 backdrop-blur-sm text-white border border-white/20">
                <FiDollarSign size={16} />
                {userChoice?.budget} Budget
              </div>
              <div className="badge bg-white/20 backdrop-blur-sm text-white border border-white/20">
                <FiUsers size={16} />
                {userChoice?.people}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="container-app mt-10 relative z-10">
        <div className="grid grid-cols-3 gap-4 max-w-xl">
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {tripData?.tripData?.hotels?.length || 0}
            </div>
            <div className="text-sm text-slate-500">Hotels</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {tripData?.tripData?.itinerary?.length || 0}
            </div>
            <div className="text-sm text-slate-500">Days Planned</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {tripData?.tripData?.itinerary?.reduce((acc, day) => acc + (day.Places?.length || 0), 0) || 0}
            </div>
            <div className="text-sm text-slate-500">Places</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
