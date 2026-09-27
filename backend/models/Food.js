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
    enum: ['breakfast', 'lunch', 'snacks', 'beverages', 'desserts', 'Breakfast', 'Lunch', 'Snacks', 'Beverages', 'Desserts', 'Meals']
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
  isAvailable: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 4.8
  },
  ratings: {
    average: { type: Number, default: 4.8 },
    count: { type: Number, default: 42 }
  },
  prepTimeMinutes: {
    type: Number,
    default: 10
  },
  preparationTime: {
    type: Number,
    default: 10
  },
  tags: {
    type: [String],
    default: ['vegetarian']
  },
  popular: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

foodSchema.pre('save', function () {
  const hasStock = Number(this.stock) > 0;
  this.isAvailable = hasStock && (this.available !== false);
  this.available = this.isAvailable;
  if (this.prepTimeMinutes) this.preparationTime = this.prepTimeMinutes;
  if (this.preparationTime) this.prepTimeMinutes = this.preparationTime;
});

export const Food = mongoose.model('Food', foodSchema);
export const MenuItem = Food;
