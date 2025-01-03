import { useParams } from "react-router-dom";
import { db } from "@/components/Service/Firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import Info from "./Info";
import Hotels from "./Hotels";
import PlacesVisit from "./PlacesVisit";
function ViewTrip() {
  const { tripId } = useParams();
  const [tripData, setTripData] = useState(null); // Initialize as null

  useEffect(() => {
    if (tripId) { // Check if tripId exists
      GetTripData();
    }
  }, [tripId]);

  const GetTripData = async () => {
    try {
      const docRef = doc(db, "AITrips", tripId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setTripData(docSnap.data());
      } else {
        console.log("No such document!");
        toast("No such document exists");
      }
    } catch (error) {
      console.error("Error fetching trip data:", error);
      toast("Error fetching trip data");
    }
  };

  return (
    <div className="p-10 md:px-20 lg:px-44 xl:px-56">
      {tripData ? (
        <Info tripData={tripData} />
      ) : (
        <p className="text-lg text-gray-500">Loading trip data...</p>
      )}
      <Hotels tripData = {tripData}/>
      <PlacesVisit tripData ={tripData}/>
    </div>

  );
}

export default ViewTrip;
