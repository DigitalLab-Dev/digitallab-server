import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import blogRouter from './routes/BlogRoutes.js';
import annoucementRouter from './routes/annoucement.js';
import videoRouter from './routes/video.js';
import galleryRouter from './routes/gallery.js';
import teamRouter from './routes/team.js';
import faqRouter from './routes/FAQ.js';
import emailRouter from './routes/emailRouter.js';
const app = express();
const PORT = process.env.PORT || 4000;
connectDB();
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173','https://digitallab-admin.vercel.app','https://digitallab-xi.vercel.app','https://www.digitallabservices.com'];
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);
app.use(express.json());
app.get('/', (req, res) => {
  res.send('✅ Digital Lab server is running successfully');
});
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});
app.use('/api/blogs', blogRouter);
app.use('/api/community/annoucement', annoucementRouter);
app.use('/api/community/video', videoRouter);
app.use('/api/community/gallery', galleryRouter);
app.use('/api/team', teamRouter);
app.use('/api/faq', faqRouter);
app.use("/api/email", emailRouter);
app.listen(PORT, () => {
  console.log(`Digital Lab Server running at http://localhost:${PORT}`);
});
