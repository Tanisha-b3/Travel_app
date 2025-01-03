import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '@/components/Service/Firebase'; // Ensure correct path
import { doc, getDoc } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';

function ViewTrip() {
  const [tripDetails, setTripDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); // Fetching the trip ID from URL params

  useEffect(() => {
    const fetchTripDetails = async () => {
      setLoading(true); // Start loading when fetching data
      try {
        const tripRef = doc(db, 'AITrips', id);
        const tripDoc = await getDoc(tripRef);

        if (tripDoc.exists()) {
          setTripDetails(tripDoc.data()); // Set data if trip found
        } else {
          toast.error('Trip not found');
        }
      } catch (error) {
        console.error('Error fetching trip details:', error);
        toast.error('Failed to load trip details');
      } finally {
        setLoading(false); // Stop loading once the fetch is complete
      }
    };

    fetchTripDetails();
  }, [id]); // Dependency array ensures effect runs only when ID changes

  if (loading) {
    return <p className="text-center text-gray-600">Loading trip details...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {tripDetails ? (
        <>
          <h2 className="font-bold text-4xl text-center text-gray-800">{tripDetails.userChoice.destination}</h2>
          <p className="text-center text-gray-600 text-xl">Details for your trip</p>

          <div className="mt-10">
            <h3 className="text-2xl font-semibold text-gray-700">Trip Information</h3>
            <p className="text-lg text-gray-700">Days: {tripDetails.userChoice.days}</p>
            <p className="text-lg text-gray-700">Budget: {tripDetails.userChoice.budget}</p>
            <p className="text-lg text-gray-700">People: {tripDetails.userChoice.people}</p>
          </div>

          <div className="mt-6">
            <h3 className="text-2xl font-semibold text-gray-700">Itinerary</h3>
            <div className="mt-4">
              <pre className="bg-gray-100 p-4 rounded-lg">{JSON.stringify(tripDetails.tripData, null, 2)}</pre>
            </div>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-600">Trip details not found.</p>
      )}
    </div>
  );
}

export default ViewTrip;
