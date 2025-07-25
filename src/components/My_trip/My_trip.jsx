import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '@/components/Service/Firebase';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';
import { FiCalendar, FiUsers, FiDollarSign, FiMapPin, FiClock, FiStar } from 'react-icons/fi';
import { FaHotel, FaUtensils, FaLandmark } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function ViewTrip() {
  const [tripDetails, setTripDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('itinerary');
  const { id } = useParams();

  useEffect(() => {
    const fetchTripDetails = async () => {
      setLoading(true);
      try {
        const tripRef = doc(db, 'AITrips', id);
        const tripDoc = await getDoc(tripRef);

        if (tripDoc.exists()) {
          setTripDetails({
            id: tripDoc.id,
            ...tripDoc.data()
          });
        } else {
          toast.error('Trip not found');
        }
      } catch (error) {
        console.error('Error fetching trip details:', error);
        toast.error('Failed to load trip details');
      } finally {
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [id]);

  const renderDayCard = (day, index) => {
    return (
      <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="bg-blue-600 text-white px-5 py-3">
          <h3 className="font-bold text-lg">Day {index + 1}</h3>
        </div>
        <div className="p-5">
          {day.Places?.length > 0 ? (
            <div className="space-y-4">
              {day.Places.map((place, placeIndex) => (
                <div key={placeIndex} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {place['Place Type'] === 'hotel' ? (
                        <FaHotel className="text-blue-500 text-xl" />
                      ) : place['Place Type'] === 'restaurant' ? (
                        <FaUtensils className="text-green-500 text-xl" />
                      ) : (
                        <FaLandmark className="text-purple-500 text-xl" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-semibold text-gray-800">{place['Place Name']}</h4>
                      <p className="text-sm text-gray-600 mt-1">{place['Place Details']}</p>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm">
                        {place['Time to Travel'] && (
                          <span className="flex items-center text-gray-500">
                            <FiClock className="mr-1" /> {place['Time to Travel']}
                          </span>
                        )}
                        {place['Ticket Pricing'] && (
                          <span className="flex items-center text-gray-500">
                            <FiDollarSign className="mr-1" /> {place['Ticket Pricing']}
                          </span>
                        )}
                        {place['Best Time to Visit'] && (
                          <span className="flex items-center text-gray-500">
                            <FiStar className="mr-1" /> {place['Best Time to Visit']}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No activities planned for this day</p>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-10">
          <Skeleton height={40} width={300} className="mx-auto" />
          <Skeleton height={24} width={200} className="mx-auto mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} height={120} className="rounded-xl" />
          ))}
        </div>
        <div className="flex space-x-4 mb-6">
          {['itinerary', 'hotels', 'summary'].map((tab) => (
            <Skeleton key={tab} height={40} width={100} />
          ))}
        </div>
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} height={150} className="rounded-xl mb-4" />
        ))}
      </div>
    );
  }

  if (!tripDetails) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Trip Not Found</h2>
        <p className="text-gray-600 mb-6">The trip you're looking for doesn't exist or may have been deleted.</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Trip Header */}
      <div className="text-center mb-10">
        <h2 className="font-bold text-4xl text-gray-800 mb-2">
          {tripDetails.userChoice.destination}
        </h2>
        <p className="text-xl text-gray-600">Your personalized travel itinerary</p>
      </div>

      {/* Trip Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <FiCalendar className="text-blue-600 text-2xl" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Duration</h3>
            <p className="text-xl font-semibold text-gray-800">
              {tripDetails.userChoice.days} {tripDetails.userChoice.days === 1 ? 'Day' : 'Days'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <FiUsers className="text-green-600 text-2xl" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Travelers</h3>
            <p className="text-xl font-semibold text-gray-800">
              {tripDetails.userChoice.people} {tripDetails.userChoice.people === 1 ? 'Person' : 'People'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
          <div className="bg-purple-100 p-3 rounded-full mr-4">
            <FiDollarSign className="text-purple-600 text-2xl" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Budget</h3>
            <p className="text-xl font-semibold text-gray-800">
              {tripDetails.userChoice.budget}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-4 px-6 font-medium text-sm border-b-2 ${activeTab === 'itinerary' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('itinerary')}
        >
          Itinerary
        </button>
        <button
          className={`py-4 px-6 font-medium text-sm border-b-2 ${activeTab === 'hotels' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('hotels')}
        >
          Hotels
        </button>
        <button
          className={`py-4 px-6 font-medium text-sm border-b-2 ${activeTab === 'summary' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('summary')}
        >
          Summary
        </button>
      </div>

      {/* Tab Content */}
      <div className="mb-10">
        {activeTab === 'itinerary' && (
          <div>
            {tripDetails.tripData.itinerary?.length > 0 ? (
              tripDetails.tripData.itinerary.map((day, index) => renderDayCard(day, index))
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <FiMapPin className="mx-auto text-gray-400 text-4xl mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">No Itinerary Found</h3>
                <p className="text-gray-500">We couldn't generate an itinerary for this trip.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'hotels' && (
          <div>
            {tripDetails.tripData.hotels?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tripDetails.tripData.hotels.map((hotel, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-5">
                      <h3 className="font-semibold text-lg text-gray-800 mb-2">{hotel['Hotel Name']}</h3>
                      <p className="text-sm text-gray-600 mb-3 flex items-center">
                        <FiMapPin className="mr-1" /> {hotel['Hotel Address']}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-blue-600">{hotel['Price']}</span>
                        <span className="flex items-center text-yellow-500">
                          <FiStar className="mr-1" /> {hotel['Rating']}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <FaHotel className="mx-auto text-gray-400 text-4xl mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">No Hotel Recommendations</h3>
                <p className="text-gray-500">We couldn't find hotel recommendations for this destination.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'summary' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-lg text-gray-800 mb-4">Trip Summary</h3>
            <div className="prose max-w-none">
              {tripDetails.tripData.summary ? (
                <p className="text-gray-700">{tripDetails.tripData.summary}</p>
              ) : (
                <p className="text-gray-500">No summary available for this trip.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
        >
          Back to Dashboard
        </Link>
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          onClick={() => window.print()}
        >
          Print Itinerary
        </button>
      </div>
    </div>
  );
}

export default ViewTrip;