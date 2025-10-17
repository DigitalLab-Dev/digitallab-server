import Influencer from "../models/Influencer.js";
import cloudinary from "../configs/cloudinary.js";

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = async (buffer, originalname) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'influencers',
        resource_type: 'image',
        public_id: `${Date.now()}-${originalname.split('.')[0]}`,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );
    
    uploadStream.end(buffer);
  });
};

// Helper function to delete image from Cloudinary
const deleteFromCloudinary = async (imageUrl) => {
  try {
    // Extract public_id from URL
    const urlParts = imageUrl.split('/');
    const publicIdWithExt = urlParts.slice(-2).join('/'); // folder/filename.ext
    const publicId = publicIdWithExt.split('.')[0]; // Remove extension
    
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
  }
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

    // Upload to Cloudinary
    const imageUrl = await uploadToCloudinary(req.file.buffer, req.file.originalname);

    // Split keywords by comma and trim whitespace
    const keywordsArray = keywords ? keywords.split(",").map(k => k.trim()).filter(k => k) : [];

    const influencer = await Influencer.create({ 
      name: name.trim(), 
      desc: desc.trim(), 
      pic: imageUrl, 
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
      // Get the old influencer to delete old image
      const oldInfluencer = await Influencer.findById(req.params.id);
      
      if (oldInfluencer && oldInfluencer.pic) {
        // Delete old image from Cloudinary
        await deleteFromCloudinary(oldInfluencer.pic);
      }

      // Upload new image to Cloudinary
      const imageUrl = await uploadToCloudinary(req.file.buffer, req.file.originalname);
      updateData.pic = imageUrl;
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
    const influencer = await Influencer.findById(req.params.id);
    
    if (!influencer) {
      return res.status(404).json({ message: "Not found" });
    }

    // Delete image from Cloudinary if exists
    if (influencer.pic) {
      await deleteFromCloudinary(influencer.pic);
    }

    // Delete influencer from database
    await Influencer.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: "Influencer deleted successfully" });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: error.message });
  }
};