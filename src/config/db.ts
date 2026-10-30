import mysql, { RowDataPacket } from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'portfolio_db',
  port: parseInt(process.env.DB_PORT || '4000'),
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true, minVersion: 'TLSv1.2' } : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Function to auto-create tables on startup
export const createTables = async () => {
  try {
    const connection = await pool.getConnection();

    // Projects table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        long_description TEXT,
        thumbnail VARCHAR(500),
        images TEXT,
        tags TEXT,
        live_url VARCHAR(500),
        github_url VARCHAR(500),
        featured BOOLEAN DEFAULT FALSE,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Skills table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        icon VARCHAR(255),
        category VARCHAR(100),
        sort_order INT DEFAULT 0
      )
    `);

    // Experience table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS experience (
        id INT AUTO_INCREMENT PRIMARY KEY,
        company VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        duration VARCHAR(255),
        description TEXT,
        is_current BOOLEAN DEFAULT FALSE,
        sort_order INT DEFAULT 0
      )
    `);

    // Messages table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Admin Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // About Content table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS about_content (
        id INT PRIMARY KEY DEFAULT 1,
        subtitle VARCHAR(255),
        location VARCHAR(255),
        quote TEXT,
        bio TEXT,
        bio_highlight TEXT,
        photo VARCHAR(255),
        gallery_1 TEXT,
        gallery_2 TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Migration to update existing table if needed
    try {
      await connection.query(`ALTER TABLE about_content MODIFY COLUMN gallery_1 TEXT`);
      await connection.query(`ALTER TABLE about_content MODIFY COLUMN gallery_2 TEXT`);
      // We don't drop gallery_3 to prevent errors if it's already dropped, but we could ignore errors.
      await connection.query(`ALTER TABLE about_content DROP COLUMN gallery_3`).catch(() => {});
    } catch (e) {
      // Ignore migration errors
    }

    // Seed about content if empty
    const [aboutRows] = await connection.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM about_content');
    if (aboutRows[0].count === 0) {
      await connection.query(`
        INSERT INTO about_content 
        (id, subtitle, location, quote, bio, bio_highlight, photo, gallery_1, gallery_2)
        VALUES (
          1, 
          'Frontend Developer & Data Scientist', 
          'Coimbatore, India', 
          'I like to think outside the box when building, combining data and full-stack development but always keeping usability in mind.', 
          'I\\'m a 3rd-year Integrated MSc Data Science student at Coimbatore Institute of Technology (2023–2028 batch), currently interning and building at the intersection of data and full-stack development.\n\nI work with React, Node.js, Python, and ML frameworks to ship products that are both intelligent and user-friendly. I believe in learning by building — from AI symptom checkers to e-commerce analytics tools, I ship complete, real-world projects.',
          'Currently exploring data engineering, MLOps, and scalable web architectures. Building intelligent interfaces is one of my greatest joys in life.',
          '/images/home.jpg',
          '["/images/home.jpg"]',
          '["/images/home.jpg"]'
        )
      `);
      console.log('✅ About content seeded.');
    }

    // Home Hero table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS home_hero (
        id INT PRIMARY KEY DEFAULT 1,
        name VARCHAR(255) DEFAULT 'Malai Raj R',
        titles TEXT,
        image VARCHAR(500) DEFAULT '/images/home.jpg',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Seed Home Hero
    await connection.query(`
      INSERT IGNORE INTO home_hero (id, name, titles, image)
      VALUES (1, 'Malai Raj R', '["DEVELOPER","DATA SCIENTIST","DATA ANALYST"]', '/images/home.jpg')
    `);

    // Home About table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS home_about (
        id INT PRIMARY KEY DEFAULT 1,
        bio TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Seed Home About
    await connection.query(`
      INSERT IGNORE INTO home_about (id, bio)
      VALUES (1, 'I am a Data Science student building at the intersection of data and full-stack development, shipping products that are both intelligent and user-friendly.')
    `);

    // Home Skills Background table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS home_skills_bg (
        id INT PRIMARY KEY DEFAULT 1,
        line1 VARCHAR(255) DEFAULT 'LET ME LEND YOU',
        line2 VARCHAR(255) DEFAULT 'A HAND WITH',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Seed Home Skills Background
    await connection.query(`
      INSERT IGNORE INTO home_skills_bg (id, line1, line2)
      VALUES (1, 'LET ME LEND YOU', 'A HAND WITH')
    `);

    // Site Settings table (singleton id=1)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id INT PRIMARY KEY DEFAULT 1,
        owner_name VARCHAR(255) DEFAULT '',
        first_name VARCHAR(255) DEFAULT '',
        last_name VARCHAR(255) DEFAULT '',
        brand_text VARCHAR(255) DEFAULT '',
        location VARCHAR(255) DEFAULT '',
        contact_email VARCHAR(255) DEFAULT '',
        badge_text VARCHAR(255) DEFAULT '',
        meta_title VARCHAR(255) DEFAULT '',
        meta_description TEXT,
        instagram VARCHAR(500) DEFAULT '',
        linkedin VARCHAR(500) DEFAULT '',
        github VARCHAR(500) DEFAULT '',
        whatsapp VARCHAR(500) DEFAULT '',
        behance VARCHAR(500) DEFAULT '',
        dribbble VARCHAR(500) DEFAULT '',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Seed site settings if none exists
    const [settingsRows] = await connection.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM site_settings');
    if (settingsRows[0].count === 0) {
      await connection.query(`
        INSERT INTO site_settings (
          id, owner_name, first_name, last_name, brand_text, location, contact_email,
          badge_text, meta_title, meta_description, instagram, linkedin, github, whatsapp, behance, dribbble
        ) VALUES (
          1,
          'Your Name',
          'YOUR',
          'NAME',
          'PORTFOLIO WORKS',
          'City, Country',
          'hello@example.com',
          'Creative Developer • Engineer • ',
          'Portfolio',
          'Personal portfolio and showcase of projects',
          '',
          '',
          '',
          '',
          '',
          ''
        )
      `);
      console.log('✅ Site settings seeded.');
    }

    // Seed admin user if none exists
    const [adminRows] = await connection.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM admin_users');
    if (adminRows[0].count === 0) {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
      const adminPassword = process.env.ADMIN_PASSWORD || 'password123';
      const hashedPassword = bcrypt.hashSync(adminPassword, 10);
      
      await connection.query(
        'INSERT IGNORE INTO admin_users (email, password) VALUES (?, ?)',
        [adminEmail, hashedPassword]
      );
      console.log('✅ Admin user seeded from .env credentials.');
    }

    // Section Visibility table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS section_visibility (
        section_key VARCHAR(100) PRIMARY KEY,
        label VARCHAR(255) NOT NULL,
        page VARCHAR(50) NOT NULL,
        is_visible BOOLEAN DEFAULT TRUE,
        is_locked BOOLEAN DEFAULT FALSE,
        sort_order INT DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Seed Section Visibility
    await connection.query(`
      INSERT IGNORE INTO section_visibility (section_key, label, page, is_visible, is_locked, sort_order)
      VALUES
        ('home.hero', 'Hero + Navbar', 'Home', TRUE, TRUE, 1),
        ('home.about', 'About intro', 'Home', TRUE, FALSE, 2),
        ('home.projects', 'Projects', 'Home', TRUE, FALSE, 3),
        ('home.circular_work', 'Circular Work', 'Home', TRUE, FALSE, 4),
        ('home.skills', 'Skills', 'Home', TRUE, FALSE, 5),
        ('home.experience', 'Experience', 'Home', TRUE, FALSE, 6),
        ('about.hero', 'About Hero + Navbar', 'About', TRUE, TRUE, 7),
        ('about.quote_photo', 'Quote & Photo', 'About', TRUE, FALSE, 8),
        ('about.bio', 'Bio', 'About', TRUE, FALSE, 9),
        ('about.gallery', 'Gallery', 'About', TRUE, FALSE, 10),
        ('projects.hero', 'Projects Hero', 'Projects', TRUE, FALSE, 11),
        ('projects.list', 'Projects List', 'Projects', TRUE, FALSE, 12),
        ('global.contact', 'Contact footer (all pages)', 'Global', TRUE, FALSE, 13)
    `);

    console.log('✅ Database tables verified/created successfully.');
    connection.release();
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    process.exit(1);
  }
};

export default pool;
