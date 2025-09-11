import Blog from '../models/Blog.js';
import cloudinary from '../configs/cloudinary.js';
import { generateSlug } from '../utils/generateSlug.js';
import { calculateReadingTime } from '../utils/calculateReadingTime.js';

export const createBlog = async (req, res) => {
  try {
    const { title, excerpt, content, category } = req.body;

    // Validation
    if (!title || !excerpt || !content || !category) {
      return res
        .status(400)
        .json({ error: 'All required fields must be filled' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'At least one image is required' });
    }

    // Upload images to Cloudinary
    let uploadedUrls = [];
    for (const file of req.files) {
      const uploadRes = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: 'digitallab_blogs' }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(file.buffer);
      });

      uploadedUrls.push({
        url: uploadRes.secure_url,
        public_id: uploadRes.public_id,
      });
    }

    // Generate slug & reading time
    const slug = generateSlug(title);
    const readingTime = calculateReadingTime(content);

    // Create blog entry
    const blog = await Blog.create({
      title,
      slug,
      excerpt,
      content,
      readingTime,
      images: uploadedUrls,
      category,
      views: 0,
    });

    return res.status(201).json({
      success: true,
      message: '✅ Blog created successfully!',
      blog,
    });
  } catch (error) {
    console.error('❌ Error creating blog:', error);
    return res.status(500).json({
      error: error.message || 'Internal Server Error',
    });
  }
};

export const getBlogs = async (req, res) => {
  try {
    // Extract query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const search = req.query.search || '';
    const category = req.query.category || 'all';

    // Build filter
    let filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    if (category !== 'all') {
      filter.category = category;
    }

    // Count total
    const totalBlogs = await Blog.countDocuments(filter);

    // Query blogs
    const blogs = await Blog.find(filter)
      .select('title slug excerpt category readingTime images createdAt views')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Response
    res.json({
      success: true,
      blogs,
      page,
      limit,
      totalBlogs,
      totalPages: Math.ceil(totalBlogs / limit),
      hasPrev: page > 1,
      hasNext: page < Math.ceil(totalBlogs / limit),
    });
  } catch (error) {
    console.error('❌ Error fetching blogs:', error);
    res.status(500).json({ message: 'Server error while fetching blogs' });
  }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // Validate slug
    if (!slug) {
      return res.status(400).json({
        error: 'Blog slug is required',
      });
    }

    // Find blog by slug and increment views atomically
    const blog = await Blog.findOneAndUpdate(
      { slug },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!blog) {
      return res.status(404).json({
        error: 'Blog not found',
      });
    }
    return res.status(200).json({
      message: '✅ Blog retrieved successfully!',
      blog,
    });
  } catch (error) {
    console.error('❌ Error fetching blog by slug:', error);
    return res.status(500).json({
      error: error.message || 'Internal Server Error',
    });
  }
};

export const removeBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Blog ID is required' });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    if (blog.images?.length > 0) {
      for (const img of blog.images) {
        if (img.public_id) {
          try {
            await cloudinary.uploader.destroy(img.public_id);
          } catch (err) {
            console.error(`❌ Failed to delete image ${img.public_id}:`, err);
          }
        }
      }
    }
    await Blog.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: '✅ Blog deleted successfully',
      blog,
    });
  } catch (error) {
    console.error('❌ Error deleting blog:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: 'Blog not found' });
    }

    // Parse existingImages sent from frontend
    let existingImages = [];
    if (req.body.existingImages) {
      if (typeof req.body.existingImages === 'string') {
        try {
          existingImages = JSON.parse(req.body.existingImages);
        } catch {
          existingImages = [req.body.existingImages];
        }
      } else {
        existingImages = req.body.existingImages;
      }
    }
    const keepImages = blog.images.filter((img) =>
      existingImages.includes(img.url)
    );
    const deleteImages = blog.images.filter(
      (img) => !existingImages.includes(img.url)
    );
    for (const img of deleteImages) {
      if (img.public_id) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    // Upload new images
    let uploadedUrls = [];
    if (req.files?.length > 0) {
      for (const file of req.files) {
        const uploadRes = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: 'digitallab_blogs' }, (error, result) => {
              if (error) reject(error);
              else resolve(result);
            })
            .end(file.buffer);
        });

        uploadedUrls.push({
          url: uploadRes.secure_url,
          public_id: uploadRes.public_id,
        });
      }
    }

    // Final images = kept + new
    blog.images = [...keepImages, ...uploadedUrls];

    // Update blog fields
    if (req.body.title) {
      blog.title = req.body.title;
      blog.slug = generateSlug(req.body.title); // update slug if title changes
    }

    blog.excerpt = req.body.excerpt || blog.excerpt;
    blog.content = req.body.content || blog.content;
    blog.category = req.body.category || blog.category;

    // Recalculate reading time if content was updated
    if (req.body.content) {
      blog.readingTime = calculateReadingTime(req.body.content);
    }

    await blog.save();

    res.json({ success: true, message: '✅ Blog updated successfully', blog });
  } catch (error) {
    console.error('❌ Update Blog Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update blog' });
  }
};
