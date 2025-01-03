import road from '../assets/road.png';

const Info = ({ tripData }) => {
  // Check if tripData is available
  if (!tripData) return <p>Loading trip data...</p>; // Handle loading state

  const { userChoice } = tripData; // Destructure userChoice for readability

  return (
    <div>
      <img src={road} alt="Scenic road view" className='h-[450px] w-full object-cover rounded' />
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
}

export default Info;
