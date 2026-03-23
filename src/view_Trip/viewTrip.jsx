import { useParams } from "react-router-dom";
import { db } from "@/components/Service/Firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import Info from "./Info";
import Hotels from "./Hotels";
import PlacesVisit from "./PlacesVisit";
import { FiLoader } from "react-icons/fi";

function ViewTrip() {
  const { tripId } = useParams();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tripId) {
      GetTripData();
    }
  }, [tripId]);

  const GetTripData = async () => {
    try {
      const docRef = doc(db, "AITrips", tripId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setTripData(docSnap.data());
      } else {
        toast({
          title: "Trip not found",
          description: "This trip doesn't exist or has been deleted",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error fetching trip data:", error);
      toast({
        title: "Error",
        description: "Failed to load trip data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading your trip...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {tripData ? (
        <>
          <Info tripData={tripData} />
          <Hotels tripData={tripData} />
          <PlacesVisit tripData={tripData} />
        </>
      ) : (
        <div className="container-app py-20 text-center">
          <div className="text-6xl mb-4">🗺️</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Trip Not Found</h2>
          <p className="text-slate-600">This trip doesn't exist or has been deleted.</p>
          <a href="/Create-trip" className="btn-primary inline-block mt-6">
            Create New Trip
          </a>
        </div>
      )}
    </div>
  );
}

export default ViewTrip;
