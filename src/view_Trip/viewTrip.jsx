import { useParams, useLocation, useNavigate } from "react-router-dom";
import { db } from "@/components/Service/Firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import Info from "./Info";
import Hotels from "./Hotels";
import PlacesVisit from "./PlacesVisit";
import { FiLoader, FiSave } from "react-icons/fi";

function ViewTrip() {
  const { tripId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUnsaved, setIsUnsaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Check if trip data was passed via navigation state (unsaved trip)
    if (location.state?.unsaved && location.state?.tripData) {
      setTripData(location.state.tripData);
      setIsUnsaved(true);
      setLoading(false);
    } else if (tripId) {
      GetTripData();
    }
  }, [tripId, location.state]);

  const GetTripData = async () => {
    try {
      const docRef = doc(db, "AITrips", tripId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setTripData(docSnap.data());
        setIsUnsaved(false);
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

  const saveTrip = async () => {
    if (!tripData) return;

    setIsSaving(true);
    try {
      const docId = tripData.id;

      await setDoc(doc(db, "AITrips", docId), {
        ...tripData,
        createdAt: new Date().toISOString()
      });

      // Save to localStorage
      const savedTrip = {
        id: docId,
        name: tripData.locationDetails?.name || tripData.userChoice?.destination,
        destination: tripData.userChoice?.destination,
        savedAt: new Date().toLocaleDateString(),
        itinerary: tripData.tripData?.itinerary || []
      };

      const existingTrips = JSON.parse(localStorage.getItem('savedTrips') || '[]');
      localStorage.setItem('savedTrips', JSON.stringify([savedTrip, ...existingTrips]));

      setIsUnsaved(false);
      toast({
        title: "Trip saved!",
        description: "Your trip has been saved successfully"
      });

      navigate('/my-trips');
    } catch (error) {
      console.error("Failed to save trip:", error);
      toast({
        title: "Error",
        description: "Failed to save trip data",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
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
          {isUnsaved && (
            <div className="sticky top-0 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 shadow-lg">
              <div className="container-app flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Preview your trip - not saved yet</span>
                </div>
                <button
                  onClick={saveTrip}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition-colors disabled:opacity-70"
                >
                  {isSaving ? (
                    <>
                      <FiLoader className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave />
                      Save Trip
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
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
