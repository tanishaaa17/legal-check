# MERN Authentication App

A beautiful and modern authentication system built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- ✨ Beautiful modern UI with gradient backgrounds and smooth animations
- 🔐 Secure user authentication with JWT tokens
- 📝 User registration and login functionality
- 🔒 Password hashing with bcrypt
- 📱 Responsive design for all devices
- ⚡ Real-time form validation
- 🎨 Custom CSS without Tailwind (pure CSS with modern design)
- 🔄 Smooth form transitions between login and register

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-validator** - Input validation
- **cors** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **Axios** - HTTP client
- **Custom CSS** - Beautiful styling with gradients and animations

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   The app is already configured with your MongoDB connection string and JWT secret in `config.env`.

3. **Start the server:**
   ```bash
   npm run server
   ```
   The server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the React app:**
   ```bash
   npm start
   ```
   The app will open on `http://localhost:3000`

### Run Both (Development)

From the root directory:
```bash
npm run dev
```

This will start both the backend server and React frontend concurrently.

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login existing user
- `GET /api/profile` - Get user profile (protected route)

### Request/Response Examples

#### Register
```json
POST /api/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```json
POST /api/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

## Features in Detail

### Security
- Passwords are hashed using bcrypt with salt rounds of 10
- JWT tokens for session management
- Input validation on both frontend and backend
- CORS enabled for cross-origin requests

### UI/UX
- Modern gradient background
- Glassmorphism design with backdrop blur
- Smooth hover animations
- Password visibility toggle
- Loading states with spinners
- Responsive design for mobile devices
- Form validation with real-time feedback

### State Management
- React hooks for state management
- Local storage for token persistence
- Form state management with controlled components

## Project Structure

```
personal-1/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── App.js         # Main React component
│       ├── App.css        # App-specific styles
│       └── index.css      # Global styles
├── server.js              # Express server
├── config.env             # Environment variables
├── package.json           # Backend dependencies
└── README.md             # This file
```

## Usage

1. Start the backend server
2. Start the React frontend
3. Navigate to `http://localhost:3000`
4. Register a new account or login with existing credentials
5. Enjoy the beautiful authentication experience!

## Environment Variables

The app uses the following environment variables (already configured):

- `JWT_SECRET` - Secret key for JWT token generation
- `MONGODB_URI` - MongoDB connection string
- `PORT` - Server port (default: 5000)

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project for your own applications. 