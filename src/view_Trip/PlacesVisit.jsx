import road from "../assets/road.png";
import "./PlacesToVisit.css"

const PlacesVisit = ({ tripData }) => {
  const itinerary = tripData?.tripData?.itinerary?.days; // Access `days` from `itinerary`

  console.log("Full tripData received:", tripData);
  console.log("Extracted itinerary:", itinerary);

  return (
    <div className="places-visit-container">
      {/* Check if itinerary exists and contains days */}
      {itinerary && Array.isArray(itinerary) && itinerary.length > 0 ? (
        itinerary.map((dayData, dayIndex) => (
          <div key={dayIndex} className="day-container">
            <h2 className="day-title">Day {dayIndex + 1}</h2>
            <p className="best-time">
              Best Time to Visit: {dayData.bestTimeToVisit || "No data available"}
            </p>

            {/* Check if places exist for the day */}
            {dayData.places && Array.isArray(dayData.places) && dayData.places.length > 0 ? (
              dayData.places.map((place, placeIndex) => (
                <div key={placeIndex} className="place-container">
                 { <img
                    src={road}
                    alt="Default Placeholder"
                    className="place-image-placeholder"
                  />} 
                  <h3 className="place-name">{place.placeName || "Unnamed Place"}</h3>
                  <p className="place-details">{place.placeDetails || "No details available."}</p>
                  <p className="time-to-travel">
                    <strong>Travel Time:</strong> {place.timeToTravel || "Unknown"}
                  </p>
                  <p className="ticket-pricing">
                    <strong>Ticket Price:</strong> {place.ticketPricing || "Not Specified"}
                  </p>
                  {/* Always use the 'road' image */}
                </div>
              ))
            ) : (
              <p className="no-places">No places to visit on this day.</p>
            )}
          </div>
        ))
      ) : (
        <p className="no-itinerary">No itinerary available.</p>
      )}
    </div>
  );
};

export default PlacesVisit;
