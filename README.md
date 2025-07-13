<<<<<<< HEAD
# Legal Check Platform

A comprehensive legal services platform built with the MERN stack (MongoDB, Express.js, React, Node.js). The platform provides user authentication, secure login/registration, and a dashboard for uploading and simplifying legal documents using AI.
=======
# ⚖️ LegalEase

**LegalEase** uses Large Language Models (LLMs) like **ChatGPT** or **Gemini** to analyze, understand, simplify, and generate legal content.
>>>>>>> c1598a82b0b0dbf50800690ad97195f9536a9c4d

---

<<<<<<< HEAD
- User authentication with JWT tokens
- Secure password hashing with bcrypt
- PDF upload and processing
- AI-powered legal document simplification using Gemini API
- Protected dashboard routes
- Modern responsive UI with custom CSS
=======
## 🚀 Features
>>>>>>> c1598a82b0b0dbf50800690ad97195f9536a9c4d

LegalEase is designed to assist both legal professionals and everyday users with tasks such as:

<<<<<<< HEAD
### Backend
- Node.js and Express.js
- MongoDB with Mongoose
- JWT authentication
- Multer for file uploads
- pdf-parse for PDF text extraction
- Axios for API calls
- bcryptjs for password hashing

### Frontend
- React with React Router
- Axios for HTTP requests
- Custom CSS styling
- File upload handling

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account
- Google AI Studio API key for Gemini

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/tanishaaa17/legal-check.git
   cd legal-check
   ```

2. Install all dependencies:
   ```bash
   npm run install-all
   ```

3. Set up environment variables:
   - Copy `backend/config/config.env.example` to `backend/config/config.env`
   - Update with your MongoDB connection string, JWT secret, and Gemini API key

4. Start development servers:
   ```bash
   npm run dev
   ```

## Available Scripts

### Root Level Commands
```bash
npm run dev              # Start both backend and frontend
npm run server           # Start only backend
npm run client           # Start only frontend
npm run build            # Build frontend for production
npm run install-all      # Install all dependencies
```

### Backend Commands (from backend directory)
```bash
npm run dev              # Start backend with nodemon
npm start                # Start backend in production
```

### Frontend Commands (from frontend directory)
```bash
npm start                # Start React development server
npm run build            # Build for production
```

## Usage

1. Register a new account or login with existing credentials
2. Access the dashboard after successful authentication
3. Upload a PDF legal document
4. View the AI-simplified version of the legal content
5. Logout when finished

## API Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login existing user
- `GET /api/auth/profile` - Get user profile (protected)
- `POST /api/upload-pdf` - Upload and process PDF (protected)

## Environment Variables

Create `backend/config/config.env` with:
```
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_connection_string
PORT=5001
GEMINI_API_KEY=your_gemini_api_key
```

## Author

Tanisha Agarwal - GitHub: @tanishaaa17
=======
- 📝 **Summarizing** lengthy legal documents  
- 🧾 **Generating** legal templates (e.g., contracts, NDAs)  
- 🗣 **Explaining** legal jargon in simple terms  
- 🌍 **Translating** legal documents into local languages  
- 🔍 **Extracting** important clauses or obligations  

---

## 🤝 Contributing

Feel free to fork the repo, submit issues, or propose enhancements.  
All contributions are welcome to help improve LegalEase!

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use it in your own applications.

>>>>>>> c1598a82b0b0dbf50800690ad97195f9536a9c4d
