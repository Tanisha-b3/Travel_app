import express from 'express';
import Trip from '../models/Trip.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/trips
// @desc    Create a new trip
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { tripName, destination, startDate, endDate, duration, budget, companions } = req.body;

    if (!tripName || !destination) {
      return res.status(400).json({
        success: false,
        message: 'Trip name and destination are required'
      });
    }

    const trip = await Trip.create({
      userId: req.user._id,
      tripName,
      destination,
      startDate,
      endDate,
      duration,
      budget,
      companions
    });

    // Add trip to user's trips array
    await User.findByIdAndUpdate(req.user._id, { $push: { trips: trip._id } });

    res.status(201).json({
      success: true,
      trip
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating trip',
      error: error.message
    });
  }
});

// @route   GET /api/trips
// @desc    Get all trips for user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      trips,
      count: trips.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching trips',
      error: error.message
    });
  }
});

// @route   GET /api/trips/:tripId
// @desc    Get single trip by ID
// @access  Private
router.get('/:tripId', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Check if user owns this trip
    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this trip'
      });
    }

    res.json({
      success: true,
      trip
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching trip',
      error: error.message
    });
  }
});

// @route   PUT /api/trips/:tripId
// @desc    Update trip
// @access  Private
router.put('/:tripId', protect, async (req, res) => {
  try {
    let trip = await Trip.findById(req.params.tripId);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Check if user owns this trip
    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this trip'
      });
    }

    // Update fields
    const allowedFields = ['tripName', 'destination', 'startDate', 'endDate', 'duration', 'budget', 'companions', 'itinerary', 'hotels', 'restaurants', 'notes', 'image'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        trip[field] = req.body[field];
      }
    });

    trip.updatedAt = Date.now();
    await trip.save();

    res.json({
      success: true,
      trip
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating trip',
      error: error.message
    });
  }
});

// @route   DELETE /api/trips/:tripId
// @desc    Delete trip
// @access  Private
router.delete('/:tripId', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Check if user owns this trip
    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this trip'
      });
    }

    await Trip.findByIdAndDelete(req.params.tripId);

    // Remove trip from user's trips array
    await User.findByIdAndUpdate(req.user._id, { $pull: { trips: req.params.tripId } });

    res.json({
      success: true,
      message: 'Trip deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting trip',
      error: error.message
    });
  }
});

export default router;
