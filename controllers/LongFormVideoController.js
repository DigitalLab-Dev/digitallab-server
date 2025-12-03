import LongFormVideo from "../models/LongFormVideo.js";

export const createLongFormVideo = async (req, res) => {
  try {
    const { title, videoId } = req.body;

    if (!title || !videoId) {
      return res.status(400).json({ error: "Title and Video ID are required" });
    }

    const existingVideo = await LongFormVideo.findOne({ videoId });
    if (existingVideo) {
      return res.status(400).json({ error: "Video already exists" });
    }

    const video = await LongFormVideo.create({ title, videoId });

    return res.status(201).json({
      success: true,
      message: "✅ Long video added successfully!",
      video,
    });
  } catch (error) {
    console.error("❌ Error creating long video:", error);
    return res.status(500).json({
      error: error.message || "Internal Server Error",
    });
  }
};

export const getLongFormVideos = async (req, res) => {
  try {
    const videos = await LongFormVideo.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      videos,
    });
  } catch (error) {
    console.error("❌ Error fetching long videos:", error);
    return res.status(500).json({
      error: error.message || "Internal Server Error",
    });
  }
};

export const deleteLongFormVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await LongFormVideo.findByIdAndDelete(id);

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    return res.status(200).json({
      success: true,
      message: "✅ Long video deleted successfully!",
    });
  } catch (error) {
    console.error("❌ Error deleting long video:", error);
    return res.status(500).json({
      error: error.message || "Internal Server Error",
    });
  }
};
