import mongoose, { Schema } from "mongoose";

const ShortFormVideoSchema = new Schema(
  {
    videoId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const ShortFormVideo =
  mongoose.models.ShortFormVideo ||
  mongoose.model("ShortFormVideo", ShortFormVideoSchema);
export default ShortFormVideo;
