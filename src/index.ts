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
import graphicRoutes from './routes/graphics';
import videoRoutes from './routes/videos';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - Allow all Vercel domains, localhost, custom frontend URLs, or allow all origins with reflected credentials
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman, server-to-server)
    if (!origin) return callback(null, true);

    // Always allow localhost
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }

    // Always allow any Vercel deployment (preview or production domains)
    if (origin.endsWith('.vercel.app') || origin.includes('vercel.app')) {
      return callback(null, true);
    }

    // If FRONTEND_URL is specified (can be comma-separated)
    if (process.env.FRONTEND_URL) {
      const allowed = process.env.FRONTEND_URL.split(',').map(u => u.trim());
      if (allowed.includes(origin)) {
        return callback(null, true);
      }
    }

    // Allow and reflect any origin with credentials so CORS is never blocked
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
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
app.use('/api/graphics', graphicRoutes);
app.use('/api/videos', videoRoutes);

// Initialize DB and start server
const startServer = async () => {
  await createTables();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  });
};

startServer();
