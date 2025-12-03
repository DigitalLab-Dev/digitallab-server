import express from "express";
import {
  createLongFormVideo,
  getLongFormVideos,
  deleteLongFormVideo,
} from "../controllers/LongFormVideoController.js";

const router = express.Router();

router.post("/", createLongFormVideo);
router.get("/", getLongFormVideos);
router.delete("/:id", deleteLongFormVideo);

export default router;
