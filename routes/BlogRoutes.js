import express from "express";
import upload from "../middlewares/multer.js";
import {
  createBlog,
  getBlogs,
  getBlogBySlug,   
  removeBlogById,
  updateBlog,
} from "../controllers/BlogController.js";

const blogRouter = express.Router();

// Create new blog
blogRouter.post("/", upload.array("images", 6), createBlog);

// Get all blogs (with pagination, search, category)
blogRouter.get("/", getBlogs);

// Get single blog by slug (SEO-friendly)
blogRouter.get("/:slug", getBlogBySlug);

// Update blog by ID (still using ID for admin dashboard)
blogRouter.put("/:id", upload.array("images", 4), updateBlog);

// Delete blog by ID (admin only)
blogRouter.delete("/:id", removeBlogById);

export default blogRouter;
