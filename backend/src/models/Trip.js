import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  tripName: {
    type: String,
    required: [true, 'Trip name is required'],
    trim: true
  },
  destination: {
    type: String,
    required: [true, 'Destination is required'],
    trim: true
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  duration: {
    type: Number,
    default: 1
  },
  budget: {
    type: String,
    default: 'moderate'
  },
  companions: {
    type: String,
    default: 'solo'
  },
  itinerary: [{
    day: Number,
    title: String,
    description: String,
    places: [String]
  }],
  hotels: [{
    name: String,
    address: String,
    price: String,
    image: String,
    rating: String,
    description: String
  }],
  restaurants: [{
    name: String,
    cuisine: String,
    price: String,
    image: String,
    rating: String,
    description: String
  }],
  notes: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Trip', tripSchema);
