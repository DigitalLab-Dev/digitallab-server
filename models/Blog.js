import mongoose, { Schema } from 'mongoose';

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, 
    excerpt: { type: String, maxlength: 200 }, 
    content: { type: String, required: true }, 
    readingTime: { type: Number, default: 0 },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    category: { type: String, required: true },
    views: { type: Number, default: 0 }, 
  },
  { timestamps: true } 
);

const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
export default Blog;
