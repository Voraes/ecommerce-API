import mongoose, { Schema, Types } from 'mongoose';

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide name'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please provide price'],
    },
    description: {
      type: String,
      required: [true, 'Please provide description'],
      maxlength: [1000, 'Description must be less than 1000 characters'],
    },
    image: {
      type: String,
      required: [true, 'Please provide image'],
      default: '/uploads/default.jpeg',
    },
    category: {
      type: String,
      required: [true, 'Please provide category'],
      enum: ['office', 'kitchen', 'bedroom'],
    },
    company: {
      type: String,
      required: [true, 'Please provide company'],
      enum: {
        values: ['ikea', 'marcos', 'liddy'],
        message: '{VALUE} is not supported',
      },
    },
    colors: {
      type: [String],
      required: [true, 'Please provide colors'],
      default: ['#222'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: [true, 'Please provide inventory'],
      default: 15,
    },
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Product', ProductSchema);
