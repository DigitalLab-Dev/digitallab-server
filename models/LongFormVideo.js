import mongoose, { Schema } from "mongoose";

const LongFormVideoSchema = new Schema(
  {
    title: { type: String, required: true },
    videoId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const LongFormVideo =
  mongoose.models.LongFormVideo ||
  mongoose.model("LongFormVideo", LongFormVideoSchema);
export default LongFormVideo;
