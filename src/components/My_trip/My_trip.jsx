import React, { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle } from "lucide-react";

interface TripDetailsProps {
  tripName: string;
  onSave: (name: string) => void;
  days: string[];
  plan: { [key: string]: { location: string; image: string; description: string }[] };
  isSaved: boolean;
}

const TripDetails: React.FC<TripDetailsProps> = ({ tripName, onSave, days, plan, isSaved }) => {
  const [tripNameInput, setTripNameInput] = useState(tripName);
  const [openDayIndex, setOpenDayIndex] = useState<number | null>(null);

  const toggleDay = (index: number) => {
    setOpenDayIndex(openDayIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white py-6 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              value={tripNameInput}
              onChange={(e) => setTripNameInput(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-sm"
              placeholder="Enter Trip Name"
            />
            <button
              onClick={() => onSave(tripNameInput)}
              disabled={isSaved}
              className={`w-full px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm ${
                isSaved
                  ? "bg-green-600 text-white cursor-default"
                  : "bg-gray-800 text-white hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              }`}
            >
              {isSaved ? (
                <span className="flex items-center justify-center">
                  <CheckCircle className="mr-2 h-5 w-5" /> Saved
                </span>
              ) : (
                "Save Trip"
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {days.map((day, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div
              onClick={() => toggleDay(index)}
              className="p-4 cursor-pointer flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-medium">{day}</h2>
              {openDayIndex === index ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </div>
            {openDayIndex === index && (
              <div className="border-t border-gray-100">
                {plan[day]?.map((item, itemIndex) => (
                  <div key={itemIndex} className="p-4 space-y-3">
                    <img
                      src={item.image}
                      alt={item.location}
                      className="w-full h-48 object-cover rounded-md shadow-sm"
                    />
                    <div>
                      <h3 className="text-md font-medium">{item.location}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </main>
    </div>
  );
};

export default TripDetails;