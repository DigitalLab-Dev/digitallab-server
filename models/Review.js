import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    role: {
      type: String, // e.g., "Influencer", "YouTuber", "Entrepreneur"
      required: true,
    },
    review: {
      type: String,
      required: true,
      minlength: 10,
    },
    image: {
      type: String, // store Cloudinary URL or local path
      required: false,
    },
    approved: {
      type: Boolean,
      default: false, // must be approved by admin
    },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;
