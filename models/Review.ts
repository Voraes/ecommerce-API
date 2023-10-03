import mongoose, { Schema, Types } from 'mongoose';

const ReviewSchema = new Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Please provide rating'],
    },
    title: {
      type: String,
      trim: true,
      required: [true, 'Please provide review title'],
      maxLength: 100,
    },
    comment: {
      type: String,
      required: [true, 'Please provide review text'],
    },
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  { timestamps: true }
);

//Implemented in the Controller
//ReviewSchema.index({ user: 1, product: 1 }, { unique: true });

export default mongoose.model('Review', ReviewSchema);
