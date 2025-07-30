import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../../uploads");
const authorsDir = path.join(uploadsDir, "authors");
const publishersDir = path.join(uploadsDir, "publishers");
const booksDir = path.join(uploadsDir, "books");

[uploadsDir, authorsDir, publishersDir, booksDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { type } = req.params; // 'authors', 'publishers', or 'books'
    let uploadPath = uploadsDir;
    
    switch (type) {
      case 'authors':
        uploadPath = authorsDir;
        break;
      case 'publishers':
        uploadPath = publishersDir;
        break;
      case 'books':
        uploadPath = booksDir;
        break;
      default:
        uploadPath = uploadsDir;
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Upload single image
router.post('/upload/:type', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { type } = req.params;
    const imageUrl = `/uploads/${type}/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        url: imageUrl,
        fullUrl: `${req.protocol}://${req.get('host')}${imageUrl}`,
        size: req.file.size,
        type: type
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message
    });
  }
});

// Upload multiple images
router.post('/upload/:type/multiple', upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const { type } = req.params;
    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      url: `/uploads/${type}/${file.filename}`,
      fullUrl: `${req.protocol}://${req.get('host')}/uploads/${type}/${file.filename}`,
      size: file.size
    }));

    res.status(200).json({
      success: true,
      message: `${req.files.length} images uploaded successfully`,
      data: uploadedFiles
    });
  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message
    });
  }
});

// Delete image
router.delete('/delete/:type/:filename', (req, res) => {
  try {
    const { type, filename } = req.params;
    let filePath;
    
    switch (type) {
      case 'authors':
        filePath = path.join(authorsDir, filename);
        break;
      case 'publishers':
        filePath = path.join(publishersDir, filename);
        break;
      case 'books':
        filePath = path.join(booksDir, filename);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid type specified'
        });
    }

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.status(200).json({
        success: true,
        message: 'Image deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Delete failed',
      error: error.message
    });
  }
});

// Get all images by type
router.get('/images/:type', (req, res) => {
  try {
    const { type } = req.params;
    let imagesDir;
    
    switch (type) {
      case 'authors':
        imagesDir = authorsDir;
        break;
      case 'publishers':
        imagesDir = publishersDir;
        break;
      case 'books':
        imagesDir = booksDir;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid type specified'
        });
    }

    if (!fs.existsSync(imagesDir)) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    const files = fs.readdirSync(imagesDir);
    const images = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => {
        const filePath = path.join(imagesDir, file);
        const stats = fs.statSync(filePath);
        
        return {
          filename: file,
          url: `/uploads/${type}/${file}`,
          fullUrl: `${req.protocol}://${req.get('host')}/uploads/${type}/${file}`,
          size: stats.size,
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime
        };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      success: true,
      data: images
    });
  } catch (error) {
    console.error('Get images error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get images',
      error: error.message
    });
  }
});

export default router;
