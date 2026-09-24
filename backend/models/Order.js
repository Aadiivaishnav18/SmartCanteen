import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  foodId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  pickupSlotId: {
    type: String,
    required: true
  },
  pickupSlotTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Placed', 'Accepted', 'Preparing', 'Ready', 'Collected', 'Cancelled'],
    default: 'Placed'
  },
  queuePosition: {
    type: Number,
    default: 1
  },
  counterNumber: {
    type: String,
    default: 'Counter 1 (Express)'
  },
  estimatedPrepTime: {
    type: String,
    default: '10-12 mins'
  },
  paymentMethod: {
    type: String,
    default: 'Campus Wallet'
  }
}, { timestamps: true });

export const Order = mongoose.model('Order', orderSchema);
