import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/components/Service/Firebase';
import { Button } from '@/components/ui/button';
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function MyTrip() {
  const { tripId } = useParams(); // Get tripId from the URL
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const docRef = doc(db, "AITrips", tripId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTripData(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching trip data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [tripId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <AiOutlineLoading3Quarters className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }

  if (!tripData) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl text-red-500">
        Trip not found
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
      <h2 className="font-bold text-4xl text-center text-gray-800">Your Trip Details</h2>

      <div className="mt-10">
        <h3 className="text-2xl font-semibold text-gray-700">Destination:</h3>
        <p className="text-lg text-gray-600">{tripData.userChoice?.destination}</p>
      </div>

      <div className="mt-6">
        <h3 className="text-2xl font-semibold text-gray-700">Duration:</h3>
        <p className="text-lg text-gray-600">{tripData.userChoice?.days} Days</p>
      </div>

      <div className="mt-6">
        <h3 className="text-2xl font-semibold text-gray-700">Budget:</h3>
        <p className="text-lg text-gray-600">{tripData.userChoice?.budget}</p>
      </div>

      <div className="mt-6">
        <h3 className="text-2xl font-semibold text-gray-700">Traveling with:</h3>
        <p className="text-lg text-gray-600">{tripData.userChoice?.people}</p>
      </div>

      <div className="mt-10">
        <h3 className="text-2xl font-semibold text-gray-700">Generated Trip Plan:</h3>
        <div className="mt-4 bg-gray-100 p-4 rounded-lg">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap">{JSON.stringify(tripData.tripData, null, 2)}</pre>
        </div>
      </div>

      <div className="mt-10 flex justify-end">
        <Button
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
        >
          Go Back
        </Button>
      </div>
    </div>
  );
}

export default MyTrip;
