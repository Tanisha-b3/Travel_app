import { useState, useEffect } from 'react';
import road from '../assets/road.png'; // Fallback image

const Info = ({ tripData }) => {
  const [destinationImage, setDestinationImage] = useState(null);

  useEffect(() => {
    if (tripData?.userChoice?.destination) {
      fetchDestinationImage(tripData.userChoice.destination);
    }
  }, [tripData]);

  const fetchDestinationImage = async (query) => {
    const API_KEY = 'AIzaSyDd5bDUqkzK7lDg92cO0zOsamrQOTNC_9k'; // Replace with your API key
    const CX = '275a132bfd8b4426d'; // Replace with your CX
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query + " travel destination")}&cx=${CX}&key=${API_KEY}&searchType=image`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.items && data.items[0]) {
        setDestinationImage(data.items[0].link); // Get the first image result
      }
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  if (!tripData) return <p>Loading trip data...</p>;

  const { userChoice } = tripData;

  return (
    <div>
      <img
        src={destinationImage || road} // Use fetched image or fallback
        alt={`Scenic view of ${userChoice.destination}`}
        className='h-[450px] w-full object-cover rounded'
      />
      <div className='flex justify-between items-center'>
        <div className='my-5 flex flex-col gap-2'>
          <h2 className='font-bold text-2xl'>{userChoice.destination}</h2>
          <div className='flex gap-5'>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>
              📅 {userChoice.days} Day
            </h2>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>
              💰 {userChoice.budget} Budget
            </h2>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>
              🥂 {userChoice.people} People
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;