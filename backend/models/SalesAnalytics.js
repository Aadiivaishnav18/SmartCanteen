import mongoose from 'mongoose';

const salesAnalyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  itemsSold: [
    {
      menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
      name: String,
      quantity: Number,
      revenue: Number
    }
  ],
  mostPopularItems: [
    {
      menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
      name: String,
      quantity: Number
    }
  ],
  peakOrderTime: {
    type: String,
    default: '12:30 PM - 01:30 PM'
  }
}, { timestamps: true });

export const SalesAnalytics = mongoose.model('SalesAnalytics', salesAnalyticsSchema);
