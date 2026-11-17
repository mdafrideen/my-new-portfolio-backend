<<<<<<< HEAD
=======

>>>>>>> f8907378845f3b319470419db093cb515a756706
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createTables } from './config/db';

// Routes
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import skillRoutes from './routes/skills';
import experienceRoutes from './routes/experience';
import contactRoutes from './routes/contact';
import aboutRoutes from './routes/about';
import homeRoutes from './routes/home';
import settingsRoutes from './routes/settings';
import sectionRoutes from './routes/sections';
<<<<<<< HEAD
import graphicRoutes from './routes/graphics';
import videoRoutes from './routes/videos';
=======
>>>>>>> f8907378845f3b319470419db093cb515a756706

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

<<<<<<< HEAD
// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
=======
// Allowed frontend origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://mohamed-afrideen.vercel.app',
];

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked origin: ${origin}`));
    }
  },
  credentials: true
}));

>>>>>>> f8907378845f3b319470419db093cb515a756706
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/sections', sectionRoutes);
<<<<<<< HEAD
app.use('/api/graphics', graphicRoutes);
app.use('/api/videos', videoRoutes);

// Initialize DB and start server
const startServer = async () => {
  await createTables();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  });
=======

// Initialize DB and start server
const startServer = async () => {
  try {
    await createTables();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
>>>>>>> f8907378845f3b319470419db093cb515a756706
};

startServer();
