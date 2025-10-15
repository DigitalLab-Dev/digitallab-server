import Influencer from "../models/Influencer.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to save buffer to disk
const saveBufferToFile = (buffer, originalname) => {
  const filename = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(originalname);
  const uploadsDir = path.join(__dirname, '../uploads');
  
  // Create uploads directory if it doesn't exist
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  const uploadPath = path.join(uploadsDir, filename);
  fs.writeFileSync(uploadPath, buffer);
  
  return filename;
};

// 🟢 Create influencer
export const createInfluencer = async (req, res) => {
  try {
    console.log('Create request received');
    console.log('Body:', req.body);
    console.log('File:', req.file);

    const { name, desc, keywords } = req.body;

    if (!name || !desc) {
      return res.status(400).json({ message: "Name and description are required" });
    }

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Save buffer to disk and get filename
    const filename = saveBufferToFile(req.file.buffer, req.file.originalname);

    // Split keywords by comma and trim whitespace
    const keywordsArray = keywords ? keywords.split(",").map(k => k.trim()).filter(k => k) : [];

    const influencer = await Influencer.create({ 
      name: name.trim(), 
      desc: desc.trim(), 
      pic: filename, 
      keywords: keywordsArray 
    });

    console.log('Influencer created:', influencer);
    res.status(201).json(influencer);
  } catch (error) {
    console.error('Create error:', error);
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
    console.log('Update request received');
    console.log('Body:', req.body);
    console.log('File:', req.file);

    const { name, desc, keywords } = req.body;
    const updateData = {};

    // Only update fields that are provided
    if (name) updateData.name = name.trim();
    if (desc) updateData.desc = desc.trim();

    // Handle keywords
    if (keywords !== undefined) {
      updateData.keywords = keywords ? keywords.split(",").map(k => k.trim()).filter(k => k) : [];
    }

    // Handle image if uploaded
    if (req.file && req.file.buffer) {
      const filename = saveBufferToFile(req.file.buffer, req.file.originalname);
      updateData.pic = filename;
    }

    console.log('Update data:', updateData);

    const updated = await Influencer.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated) return res.status(404).json({ message: "Not found" });

    console.log('Updated influencer:', updated);
    res.status(200).json(updated);
  } catch (error) {
    console.error('Update error:', error);
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