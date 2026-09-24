import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Snacks', 'Meals', 'Beverages', 'Desserts']
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  available: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 4.8
  },
  prepTimeMinutes: {
    type: Number,
    default: 10
  },
  popular: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export const Food = mongoose.model('Food', foodSchema);
