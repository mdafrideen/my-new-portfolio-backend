
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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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
};

startServer();
