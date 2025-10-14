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

router.post("/", upload.single("pic"), createInfluencer); // 👈 image upload here
router.get("/", getAllInfluencers);
router.get("/:id", getInfluencerById);
router.put("/:id", updateInfluencer);
router.delete("/:id", deleteInfluencer);

export default router;
