import cloudinary from "../configs/cloudinary.js";
import Review from "../models/Review.js";


// ✅ Create new review with Cloudinary image upload
export const createReview = async (req, res) => {
  try {
    const { name, email, role, review } = req.body;

    let imageUrl = null;
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload_stream(
        { folder: "reviews", resource_type: "image" },
        (error, result) => {
          if (error) throw new Error(error.message);
          return result;
        }
      );

      // we need to wrap stream into promise
      imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "reviews" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        stream.end(req.file.buffer);
      });
    }

    const newReview = await Review.create({
      name,
      email,
      role,
      review,
      image: imageUrl,
    });

    res.status(201).json({
      message: "Review submitted successfully, pending admin approval.",
      review: newReview,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating review", error: error.message });
  }
};

// ✅ Get all reviews (admin)
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error: error.message });
  }
};

// ✅ Get only approved reviews (public)
export const getApprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching approved reviews", error: error.message });
  }
};

// ✅ Approve review
export const approveReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.status(200).json({ message: "Review approved successfully", review });
  } catch (error) {
    res.status(500).json({ message: "Error approving review", error: error.message });
  }
};

// ✅ Update review (with optional new image)
export const updateReview = async (req, res) => {
  try {
    let updateData = req.body;

    if (req.file) {
      const imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "reviews" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        stream.end(req.file.buffer);
      });
      updateData.image = imageUrl;
    }

    const updatedReview = await Review.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedReview) return res.status(404).json({ message: "Review not found" });

    res.status(200).json({ message: "Review updated successfully", review: updatedReview });
  } catch (error) {
    res.status(500).json({ message: "Error updating review", error: error.message });
  }
};

// ✅ Delete review
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting review", error: error.message });
  }
};
