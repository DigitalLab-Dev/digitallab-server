import express from "express";
import cors from "cors";
import "dotenv/config";
import blogRouter from "./routes/BlogRoutes.js";
import teamRouter from "./routes/team.js";
import faqRouter from "./routes/FAQ.js";
import emailRouter from "./routes/emailRouter.js";
import reviewRouter from "./routes/ReviewRoutes.js";
import influencerRoutes from "./routes/Influencerroutes.js";
import shortFormVideoRoutes from "./routes/ShortFormVideoRoutes.js";
import longFormVideoRoutes from "./routes/LongFormVideoRoutes.js";
import mongoose from "mongoose";

const app = express();
const PORT = process.env.PORT || 4000;

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URL, {
    family: 4,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 75000,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err.message));

// ✅ Simplified & Stable CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://digitallab-admin.vercel.app",
      "https://digitallab-xi.vercel.app",
      "https://www.digitallabservices.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(express.json());

// ✅ Base route
app.get("/", (req, res) => {
  res.send("✅ Digital Lab server is running successfully");
});

// ✅ Routers
app.use("/api/blogs", blogRouter);
app.use("/api/team", teamRouter);
app.use("/api/faq", faqRouter);
app.use("/api/email", emailRouter);
app.use("/api/review", reviewRouter);
app.use("/api/influencers", influencerRoutes);
app.use("/api/short-videos", shortFormVideoRoutes);
app.use("/api/long-videos", longFormVideoRoutes);

// ✅ Error handler (must be last)
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Digital Lab Server running at http://localhost:${PORT}`);
});
