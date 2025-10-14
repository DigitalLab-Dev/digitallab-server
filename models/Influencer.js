import mongoose from "mongoose";

const influencerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    pic: { type: String, required: true }, // will store filename or path
    desc: { type: String, required: true },
    keywords: { type: [String], default: [] },
  },
  { timestamps: true }
);

const Influencer = mongoose.model("Influencer", influencerSchema);
export default Influencer;
