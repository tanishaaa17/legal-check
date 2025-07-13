const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const axios = require('axios');
const { body, validationResult } = require('express-validator');
require('dotenv').config({ path: './config/config.env' });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Multer configuration for PDF upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'lawyer'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

// Validation middleware
const validateRegistration = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// JWT Middleware
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Routes
app.post('/api/auth/register', validateRegistration, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', validateLogin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected route example
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  res.json(req.user);
});

// Dashboard route
app.get('/api/dashboard', authenticateToken, async (req, res) => {
  try {
    // Return dashboard data
    res.json({
      user: req.user,
      stats: {
        totalCases: 0,
        pendingCases: 0,
        completedCases: 0
      },
      recentActivity: []
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PDF Upload and Processing Route
app.post('/api/upload-pdf', authenticateToken, upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No PDF file uploaded' });
    }

    // Parse PDF content
    const pdfData = await pdfParse(req.file.buffer);
    const extractedText = pdfData.text;

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ message: 'No text content found in the PDF' });
    }

    // Send to Gemini API with correct format
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: `Please simplify the following legal document content into plain English that a non-lawyer can easily understand. Make it clear, concise, and avoid legal jargon:\n\n${extractedText}`
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.8,
          maxOutputTokens: 2048,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    );

    // Check if response has the expected structure
    if (!geminiResponse.data.candidates || !geminiResponse.data.candidates[0] || !geminiResponse.data.candidates[0].content) {
      console.error('Unexpected Gemini API response structure:', geminiResponse.data);
      return res.status(500).json({ message: 'Error processing PDF. Invalid API response.' });
    }

    const simplifiedText = geminiResponse.data.candidates[0].content.parts[0].text;

    res.json({
      message: 'PDF processed successfully',
      originalText: extractedText,
      simplifiedText: simplifiedText
    });

  } catch (error) {
    console.error('PDF processing error:', error);
    
    if (error.message === 'Only PDF files are allowed') {
      return res.status(400).json({ message: 'Only PDF files are allowed' });
    }
    
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size too large. Maximum 10MB allowed.' });
    }

    // Handle specific Gemini API errors
    if (error.response) {
      console.error('Gemini API Error:', error.response.data);
      if (error.response.status === 400) {
        return res.status(400).json({ message: 'Invalid request to AI service. Please check your PDF content.' });
      }
      if (error.response.status === 403) {
        return res.status(500).json({ message: 'AI service access denied. Please try again later.' });
      }
      if (error.response.status === 429) {
        return res.status(429).json({ 
          message: 'AI service quota exceeded. Please wait a moment and try again, or upgrade your API plan.',
          details: 'You have exceeded the free tier limits. The service will reset shortly.'
        });
      }
      if (error.response.status === 404) {
        return res.status(500).json({ message: 'AI service model not found. Please contact support.' });
      }
    }

    res.status(500).json({ 
      message: 'Error processing PDF. Please try again.',
      error: error.message 
    });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 