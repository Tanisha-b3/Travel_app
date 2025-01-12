import road from "../assets/road.png";
import "./PlacesToVisit.css";

const PlacesVisit = ({ tripData }) => {
  // Accessing the itinerary data from tripData
  const itinerary = tripData?.tripData?.itinerary; // Access `itinerary` from `tripData`

  console.log("Full tripData received:", tripData);
  console.log("Extracted itinerary:", itinerary);

  return (
    <div className="places-visit-container">
      {/* Check if itinerary exists and contains days */}
      {itinerary && Array.isArray(itinerary) && itinerary.length > 0 ? (
        itinerary.map((dayData, dayIndex) => {
          console.log(`Day ${dayIndex + 1} data:`, dayData); // Log each day's data

          return (
            <div key={dayIndex} className="day-container">
              <h2 className="day-title">Day {dayIndex + 1}</h2>
              
              {/* Check if bestTimeToVisit exists */}
              {/* <p className="">
              
              </p> */}

              {/* Check if Places exist for the day */}
              {dayData?.Places && Array.isArray(dayData.Places) && dayData.Places.length > 0 ? (
                dayData.Places.map((place, placeIndex) => (
                  <div key={placeIndex} className="place-container">
                    {/* Always use the 'road' image */}
                    <img
                      src={road}
                      alt="Default Placeholder"
                      className="place-image-placeholder"
                    />
                    <h3 className="best-time">{place['Best Time to Visit']|| "No data available"}</h3>
                    <h3 className="place-name">{place['Place Name'] || "Unnamed Place"}</h3>
                    <p className="place-details">{place['Place Details'] || "No details available."}</p>
                    <p className="time-to-travel">
                      <strong>Travel Time:</strong> {place['Time to Travel'] || "Unknown"}
                    </p>
                    <p className="ticket-pricing">
                      <strong>Ticket Price:</strong> {place['Ticket Pricing']|| "Not Specified"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="no-places">No places to visit on this day.</p>
              )}
            </div>
          );
        })
      ) : (
        <p className="no-itinerary">No itinerary available.</p>
      )}
    </div>
  );
};

export default PlacesVisit;
