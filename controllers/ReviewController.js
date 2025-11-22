import cloudinary from "../configs/cloudinary.js";
import Review from "../models/Review.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});


const sendAdminNotification = async (reviewData) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "digitallab514@gmail.com",
    subject: "New Review Pending Approval",
    html: `
      <h2>New Review Submitted</h2>
      <p><strong>Name:</strong> ${reviewData.name}</p>
      <p><strong>Email:</strong> ${reviewData.email}</p>
      <p><strong>Role:</strong> ${reviewData.role}</p>
      <p><strong>Review:</strong> ${reviewData.review}</p>
      <p>Please log in to approve or reject this review.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendClientPendingEmail = async (email, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Review Submitted - Pending Approval",
    html: `
      <h2>Thank You for Your Review!</h2>
      <p>Dear ${name},</p>
      <p>Thank you for taking the time to submit your review. Your feedback is valuable to us!</p>
      <p>Your review is currently pending approval and will be published shortly after our team reviews it.</p>
      <p>We appreciate your patience and look forward to sharing your experience with others.</p>
      <br>
      <p>Best regards,</p>
      <p>The Team</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendClientApprovalEmail = async (email, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Review Has Been Approved!",
    html: `
      <h2>Your Review is Now Live!</h2>
      <p>Dear ${name},</p>
      <p>Great news! Your review has been approved and is now published on our website.</p>
      <p>Thank you for sharing your experience with us. Your feedback helps others make informed decisions and helps us continue to improve our services.</p>
      <p>We truly appreciate your support!</p>
      <br>
      <p>Best regards,</p>
      <p>The Team</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const createReview = async (req, res) => {
  try {
    const { name, email, role, review } = req.body;

    let imageUrl = null;
    if (req.file) {
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

    // Send email notifications
    try {
      await sendClientPendingEmail(email, name);
      await sendAdminNotification({ name, email, role, review });
    } catch (emailError) {
      console.error("Error sending emails:", emailError);
      // Continue even if email fails
    }

    res.status(201).json({
      message: "Review submitted successfully, pending admin approval.",
      review: newReview,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating review", error: error.message });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error: error.message });
  }
};

export const getApprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching approved reviews", error: error.message });
  }
};

export const approveReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Send approval email to client
    try {
      await sendClientApprovalEmail(review.email, review.name);
    } catch (emailError) {
      console.error("Error sending approval email:", emailError);
      // Continue even if email fails
    }

    res.status(200).json({ message: "Review approved successfully", review });
  } catch (error) {
    res.status(500).json({ message: "Error approving review", error: error.message });
  }
};

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

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting review", error: error.message });
  }
};