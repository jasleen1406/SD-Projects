# 🚀 Real-Time Chat Application

A powerful **full-stack real-time chat platform** built using **Node.js, Express, Socket.IO, MongoDB, and Passport.js**.  
This application supports **live messaging, secure authentication, room ownership controls, typing indicators, profanity filtering, location sharing, and persistent room chat history**.

Designed to simulate real-world communication systems with advanced room lifecycle management and authentication workflows.

---

# ✨ Features

## 🔐 Authentication System
- ✅ User Registration & Login
- ✅ Secure password hashing using **bcrypt**
- ✅ **Google OAuth 2.0** integration
- ✅ Session-based authentication
- ✅ Protected routes for authenticated users
- ✅ Persistent sessions using MongoDB
- ✅ Local fallback authentication if database unavailable

---

## 💬 Real-Time Chat System
- ⚡ Instant messaging using **Socket.IO**
- ⚡ Multi-room chat functionality
- ⚡ Live room joining and leaving
- ⚡ Real-time participant updates
- ⚡ Real-time admin notifications
- ⚡ Fast event-driven communication

---

## 👑 Advanced Room Ownership Logic
- 🔥 First user automatically becomes room owner
- 🔥 Room owner can end the room for everyone
- 🔥 Automatic room ownership transfer when owner leaves
- 🔥 Live room ownership updates for all participants

---

## 🧠 Smart Chat Features
- 📝 Typing indicators
- 🛑 Stop typing detection
- 📍 Live location sharing with Google Maps links
- 🚫 Profanity filtering for safe conversations
- 📜 In-memory room-based chat history
- 🎉 Welcome messages
- 🔄 Join/leave notifications

---

## 🗄 Database & Session Handling
- 💾 MongoDB user storage
- 💾 Session persistence with **connect-mongo**
- 💾 Environment-based config using **dotenv**
- 💾 In-memory fallback mode if MongoDB unavailable

---

# 🛠 Tech Stack

## Backend Technologies
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Backend framework |
| Socket.IO | Real-time communication |
| MongoDB | Database |
| Mongoose | Database modeling |

---

## Authentication
| Technology | Purpose |
|---|---|
| Passport.js | Authentication middleware |
| Passport Local Strategy | Email/password auth |
| Passport Google OAuth 2.0 | Google login |
| bcryptjs | Password hashing |

---

## Session Management
| Technology | Purpose |
|---|---|
| express-session | Session handling |
| connect-mongo | Session storage |

---

## Utilities
| Technology | Purpose |
|---|---|
| dotenv | Environment variables |
| bad-words | Profanity filtering |

---

# 📂 Project Structure

```bash
chat-app-main/
│── public/
│   ├── index.html
│   ├── chat.html
│   ├── login.html
│   ├── css/
│   │   ├── styles.css
│   │   └── styles.min.css
│   ├── js/
│   │   └── chat.js
│   └── img/
│
│── src/
│   ├── index.js
│   ├── models/
│   │   └── user.js
│   └── utils/
│       ├── messages.js
│       └── users.js
│
│── package.json
│── package-lock.json
│── .env.example
│── README.md
```

---

# ⚙ Installation Guide

## 1️⃣ Clone the Repository

```bash
git clone <your-repository-url>
cd chat-app-main
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Setup Environment Variables

Create a `.env` file in root directory:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

# ▶ Running the Application

Run the server:

```bash
npm start
```

Server will start at:

```bash
http://localhost:3000
```

---

# 🔄 Application Workflow

## 1. Authentication
- User can register using email/password
- Or login via Google OAuth

---

## 2. Join/Create Room
- User enters username and room name
- First user becomes owner

---

## 3. Real-Time Chatting
- Send instant messages
- Receive messages in real-time

---

## 4. Smart Interactions
- View typing indicators
- Share live location
- Profanity filtering

---

## 5. Room Management
- Owner can end room
- Owner can leave and ownership transfers automatically

---

# 🌟 Core Functionalities Explained

## 🔐 Secure Authentication
Built using **Passport.js** supporting:
- Local authentication
- Google OAuth
- Session persistence

---

## ⚡ Real-Time Engine
Socket.IO powers:
- Live chat
- User joins/leaves
- Typing events
- Location events
- Room ownership updates

---

## 👑 Ownership System
Custom-built ownership logic:
- Tracks room creator
- Reassigns owner if creator disconnects
- Allows owner-only room termination

---

## 🚫 Profanity Protection
Integrated bad-word filtering to maintain cleaner chat rooms.

---

## 📍 Location Sharing
Users can send live location links directly inside chat.

---

## 📜 Chat History Buffer
Maintains the latest room messages for new users joining.

---

# 🚀 Key Highlights

✅ Full-stack architecture  
✅ Real-time communication  
✅ Authentication system  
✅ Google OAuth integration  
✅ Session management  
✅ Room ownership lifecycle  
✅ Advanced socket event handling  
✅ Database integration  
✅ Edge case handling  
✅ Production-like chat architecture  

---

# 🔮 Future Improvements

- 📁 File sharing
- 📷 Media/image sharing
- 🎙 Voice messages
- 📖 Read receipts
- 🌙 Dark mode
- 🟢 Online/offline presence
- 💾 Permanent chat history storage
- 🔔 Push notifications
- 🔐 End-to-end encryption

---

# 📌 Current Status

🖥 Running on **localhost:3000**  
🚧 Not deployed yet  
✅ Fully functional for development, demos, and interview showcases  

---

# 🎯 Interview Value

This project demonstrates strong understanding of:

- Backend development
- Real-time systems
- WebSocket communication
- Authentication workflows
- Session management
- MongoDB integration
- Room lifecycle architecture
- Event-driven programming
- Edge case handling
- Full-stack integration

Perfect for **SDE, Backend, and Full-Stack Developer interviews**.

---

# 👩‍💻 Author

**Jasleen Jassal**  
Built as a full-stack real-time communication project for learning and interview preparation.
