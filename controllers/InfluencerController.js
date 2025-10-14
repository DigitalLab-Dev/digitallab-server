import Influencer from "../models/Influencer.js";


export const createInfluencer = async (req, res) => {
  try {
    const { name, desc, keywords } = req.body;
    const pic = req.file ? req.file.filename : null;

    if (!name || !desc || !pic) {
      return res.status(400).json({ message: "Name, description, and image are required" });
    }

    const influencer = await Influencer.create({ name, desc, pic, keywords: keywords?.split(",") });
    res.status(201).json(influencer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔵 Get all influencers
export const getAllInfluencers = async (req, res) => {
  try {
    const influencers = await Influencer.find().sort({ createdAt: -1 });
    res.status(200).json(influencers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟣 Get single influencer by ID
export const getInfluencerById = async (req, res) => {
  try {
    const influencer = await Influencer.findById(req.params.id);
    if (!influencer) return res.status(404).json({ message: "Not found" });
    res.status(200).json(influencer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟠 Update influencer
export const updateInfluencer = async (req, res) => {
  try {
    const updated = await Influencer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔴 Delete influencer
export const deleteInfluencer = async (req, res) => {
  try {
    const deleted = await Influencer.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ message: "Influencer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
