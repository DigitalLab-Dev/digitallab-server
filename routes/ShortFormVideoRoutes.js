import express from "express";
import {
  createShortFormVideo,
  getShortFormVideos,
  deleteShortFormVideo,
} from "../controllers/ShortFormVideoController.js";

const router = express.Router();

router.post("/", createShortFormVideo);
router.get("/", getShortFormVideos);
router.delete("/:id", deleteShortFormVideo);

export default router;
