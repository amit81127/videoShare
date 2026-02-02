# 🎥 meetup - Video Conferencing Application

A modern, feature-rich video conferencing application built with React, Node.js, Socket.IO, and WebRTC. Connect with friends, family, and colleagues through high-quality video calls with real-time chat, screen sharing, and more.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)
![React](https://img.shields.io/badge/react-19.2.0-blue)

## ✨ Features

- 🎬 **Real-time Video Calls** - High-quality peer-to-peer video communication using WebRTC
- 💬 **Live Chat** - Send and receive messages during calls
- 🖥️ **Screen Sharing** - Share your screen with other participants
- 🎯 **Meeting Rooms** - Create or join meetings with unique room codes
- 👥 **Multiple Participants** - Support for group video calls
- 🔐 **User Authentication** - Secure login and registration system
- 📜 **Meeting History** - Track your past meetings
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🌙 **Modern UI** - Beautiful dark theme with glassmorphism effects
- ⚡ **Real-time Sync** - Powered by Socket.IO for instant updates

## 🛠️ Tech Stack

### Frontend
- **React** 19.2.0 - UI library
- **Vite** - Build tool and dev server
- **Material-UI** - Component library
- **Socket.IO Client** - Real-time communication
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Socket.IO** - WebSocket library
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **MongoDB** - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (recommended) or local installation

## 🚀 Getting Started

### 1. Clone the Repository

\`\`\`bash
git clone <repository-url>
cd meetup
\`\`\`

### 2. Backend Setup

\`\`\`bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (if not exists)
# Add your MongoDB connection string:
# MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/dbname
# PORT=8000

# Start the backend server
npm start
\`\`\`

The backend server will start on `http://localhost:8000`

### 3. Frontend Setup

\`\`\`bash
# Open a new terminal
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
\`\`\`

The frontend will be available at `http://localhost:5173` (or the port shown in terminal)

## 📁 Project Structure

\`\`\`
meetup/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── socketManager.js    # Socket.IO event handlers
│   │   │   └── user.controller.js  # User authentication logic
│   │   ├── models/
│   │   │   └── meeting.model.js    # Meeting data model
│   │   ├── routes/
│   │   │   └── users.routes.js     # API routes
│   │   └── app.js                  # Express app setup
│   ├── .env                        # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx          # Navigation component
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx     # Authentication context
│   │   ├── pages/
│   │   │   ├── landing.jsx         # Landing page
│   │   │   ├── authentication.jsx  # Login/Register
│   │   │   ├── home.jsx            # Dashboard
│   │   │   ├── VideoMeet.jsx       # Video call interface
│   │   │   └── history.jsx         # Meeting history
│   │   ├── utils/
│   │   │   └── withAuth.jsx        # Auth HOC
│   │   ├── App.js                  # Main app component
│   │   └── main.jsx                # Entry point
│   ├── public/
│   └── package.json
│
├── .gitignore
└── README.md
\`\`\`

## 🎮 Usage

### Starting a Meeting

1. **Register/Login** - Create an account or sign in
2. **Create Meeting** - Click "Start Meeting" on the home page
3. **Share Link** - Copy the meeting URL and share with participants
4. **Join Meeting** - Enter the meeting code or use the shared link

### During a Call

- 🎥 **Toggle Video** - Turn your camera on/off
- 🎤 **Toggle Audio** - Mute/unmute your microphone
- 🖥️ **Share Screen** - Share your screen with participants
- 💬 **Open Chat** - Send messages to other participants
- ❌ **End Call** - Leave the meeting

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

\`\`\`env
MONGODB_URL=your_mongodb_connection_string
PORT=8000
\`\`\`

### For Production Deployment

Update the server URLs in:
- `frontend/src/contexts/AuthContext.jsx` (line 6)
- `frontend/src/pages/VideoMeet.jsx` (line 16)

Replace `http://localhost:8000` with your production backend URL.

## 📝 Available Scripts

### Frontend

\`\`\`bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
\`\`\`

### Backend

\`\`\`bash
npm start        # Start the server
npm run dev      # Start with nodemon (auto-reload)
\`\`\`

## 🌐 API Endpoints

### User Routes

- `POST /api/v1/users/register` - Register new user
- `POST /api/v1/users/login` - User login
- `GET /api/v1/users/get_all_activity` - Get user's meeting history
- `POST /api/v1/users/add_to_activity` - Add meeting to history

### Socket Events

- `join-call` - Join a meeting room
- `signal` - WebRTC signaling
- `chat-message` - Send/receive chat messages
- `user-joined` - Participant joined notification
- `user-left` - Participant left notification

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**
\`\`\`bash
# Change the port in backend/.env or kill the process using the port
\`\`\`

**MongoDB connection failed:**
- Check your MONGODB_URL in `.env`
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify database credentials

**Video/Audio not working:**
- Grant camera and microphone permissions in browser
- Use HTTPS in production (required for getUserMedia API)
- Check browser compatibility (Chrome recommended)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created with ❤️ by [Your Name]

## 🙏 Acknowledgments

- WebRTC for peer-to-peer communication
- Socket.IO for real-time events
- Material-UI for beautiful components
- MongoDB for flexible data storage

---

⭐ If you like this project, please give it a star on GitHub!
