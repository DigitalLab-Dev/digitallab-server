import express from "express";
import upload from "../middlewares/multer.js";
import {
  createInfluencer,
  getAllInfluencers,
  getInfluencerById,
  updateInfluencer,
  deleteInfluencer,
} from "../controllers/InfluencerController.js";
const router = express.Router();
router.post("/", upload.single("pic"), createInfluencer);
router.get("/", getAllInfluencers);
router.get("/:id", getInfluencerById);
router.put("/:id", upload.single("pic"), updateInfluencer); // 👈 Added multer here too
router.delete("/:id", deleteInfluencer);
export default router;