import airplane from '../assets/airplane (1).png';
import champagne from '../assets/champagne-glass.png';
import family1 from '../assets/family.png';
import wallet from '../assets/wallet.png';
import salary from '../assets/salary.png';
import money from '../assets/money.png';
import friends from '../assets/friendship.png'
export const SelectTravelList = [
    {
        id: 1,
        title: 'justMe',
        desc: 'A sole travels in exploration',
        icon: airplane, // Directly assign the imported image
        people: '1',
    },
    {
        id: 2,
        title: 'A couple',
        desc: 'Two travels in tandem',
        icon: champagne, // Directly assign the imported image
        people: '2',
    },
    {
        id: 3,
        title: 'Family',
        desc: 'A group of fun-loving adventure',
        icon: family1, // Directly assign the imported image
        people: '3',
    },
    {

    id: 4,
    title: 'Friends',
    desc: 'A group of trill-seekers',
    icon: friends, // Directly assign the imported image
    people: '5',
    }
];

export const Budget = [
    {
        id: 1,
        title: 'Cheap',
        desc: 'Stay conscious of costs',
        icon: wallet, // Directly assign the imported image
    },
    {
        id: 2,
        title: 'Moderate',
        desc: 'Keep cost on the average side',
        icon: salary, // Directly assign the imported image
    },
    {
        id: 3,
        title: 'Luxury',
        desc: 'Don\'t worry about the cost',
        icon: money, // Directly assign the imported image
    },
];
export const AI_PROMPT = `
Generate a detailed travel plan for:
- **Location**: {location}
- **Duration**: {totalDays} days
- **Number of People**: {people}
- **Budget**: {budget}
1. **Hotels**:
   - Provide more than 4 hotel options.
   - For each hotel, include the following details:
     - Hotel Name
     - Hotel Address
     - Price
     - Hotel Image URL
     - Geo Coordinates
     - Rating
     - Description

2. **Itinerary**:
   - Suggest a itinerary with the following details for each day:
     - Place Name
     - Place Details
     - Place Image URL
     - Geo Coordinates
     - Ticket Pricing
     - Time to Travel to Each Location
     - Best Time to Visit

Output the plan in JSON format, ensuring that all details such as the hotel information, itinerary, and places are provided in the specified structure, similar to this example:
{
  "location": ,
  "duration":,
  "people": ,
  "budget": ,
  "hotels": [
    {
      "Hotel Name": ,
      "Hotel Address": ,
      "Price": "",
      "Hotel Image URL": "",
      "Geo Coordinates": ,
      "Rating": ,
      "Description": ""
    },
    ...
  ],
  "itinerary": [
    {
      "Day": "Day 1",
      "Places": [
        {
          "Place Name": ,
          "Place Details": ,
          "Place Image URL": ,
          "Geo Coordinates": ,
          "Ticket Pricing": ,
          "Time to Travel": ,
          "Best Time to Visit": 
        },
        ...
      ]
    },
    ...
  ]
}
`


