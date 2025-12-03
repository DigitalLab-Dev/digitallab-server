import ShortFormVideo from "../models/ShortFormVideo.js";

export const createShortFormVideo = async (req, res) => {
  try {
    const { videoId } = req.body;

    if (!videoId) {
      return res.status(400).json({ error: "Video ID is required" });
    }

    const existingVideo = await ShortFormVideo.findOne({ videoId });
    if (existingVideo) {
      return res.status(400).json({ error: "Video already exists" });
    }

    const video = await ShortFormVideo.create({ videoId });

    return res.status(201).json({
      success: true,
      message: "✅ Short video added successfully!",
      video,
    });
  } catch (error) {
    console.error("❌ Error creating short video:", error);
    return res.status(500).json({
      error: error.message || "Internal Server Error",
    });
  }
};

export const getShortFormVideos = async (req, res) => {
  try {
    const videos = await ShortFormVideo.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      videos,
    });
  } catch (error) {
    console.error("❌ Error fetching short videos:", error);
    return res.status(500).json({
      error: error.message || "Internal Server Error",
    });
  }
};

export const deleteShortFormVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await ShortFormVideo.findByIdAndDelete(id);

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    return res.status(200).json({
      success: true,
      message: "✅ Short video deleted successfully!",
    });
  } catch (error) {
    console.error("❌ Error deleting short video:", error);
    return res.status(500).json({
      error: error.message || "Internal Server Error",
    });
  }
};
