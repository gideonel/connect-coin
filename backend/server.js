require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDatabase = require('./config/database');

// Socket.io setup for real-time features
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user's room for private messages
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  // Handle typing indicator
  socket.on('typing', ({ matchId, userId }) => {
    socket.to(matchId).emit('user_typing', { userId });
  });

  socket.on('stop_typing', ({ matchId, userId }) => {
    socket.to(matchId).emit('user_stop_typing', { userId });
  });

  // Handle new message
  socket.on('new_message', (message) => {
    // Emit to the receiver
    io.to(message.receiver).emit('message_received', message);
  });

  // Handle read receipts
  socket.on('messages_read', ({ matchId, userId }) => {
    socket.to(matchId).emit('messages_read', { userId });
  });

  // Handle online status
  socket.on('online', (userId) => {
    socket.broadcast.emit('user_online', userId);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    server.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║   Dating App API Server                ║
╠════════════════════════════════════════╣
║   Environment: ${process.env.NODE_ENV || 'development'}
║   Port: ${PORT}
║   MongoDB: Connected
║   Socket.io: Enabled
╚════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

startServer();
