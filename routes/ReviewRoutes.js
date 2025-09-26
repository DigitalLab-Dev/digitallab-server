import express from "express";
import { approveReview, createReview, deleteReview, getAllReviews, getApprovedReviews, updateReview } from "../controllers/ReviewController.js";
import upload from "../middlewares/multer.js";
const reviewRouter = express.Router();

// Public routes
reviewRouter.post("/", upload.single("image"), createReview); // client submits review with image
reviewRouter.get("/approved", getApprovedReviews);            // only approved reviews shown

// Admin routes
reviewRouter.get("/", getAllReviews
);                         // all reviews
reviewRouter.put("/:id", upload.single("image"), updateReview); // update review (optional new image)
reviewRouter.patch("/:id/approve", approveReview);            // approve review
reviewRouter.delete("/:id", deleteReview);                    // delete review

export default reviewRouter;
