import { Request, Response } from 'express';
import pool from '../config/db';
import { RowDataPacket } from 'mysql2/promise';

// --- HERO SECTION ---
export const getHomeHero = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM home_hero WHERE id = 1');
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Hero section not found' });
    }
    const data = rows[0];
    try {
      data.titles = JSON.parse(data.titles);
    } catch (e) {
      // Keep as string if parsing fails
    }
    res.json(data);
  } catch (error) {
    console.error('Error fetching home hero:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateHomeHero = async (req: Request, res: Response) => {
  try {
    const { name, titles } = req.body;
    let image = req.body.image;
    
    if (req.file) {
      image = req.file.path; // Cloudinary returns the URL in path
    }

    let titlesStr = titles;
    if (Array.isArray(titles)) {
      titlesStr = JSON.stringify(titles);
    }

    await pool.query(
      'UPDATE home_hero SET name = ?, titles = ?, image = ? WHERE id = 1',
      [name, titlesStr, image]
    );

    res.json({ message: 'Hero section updated successfully' });
  } catch (error) {
    console.error('Error updating home hero:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// --- ABOUT SECTION ---
export const getHomeAbout = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM home_about WHERE id = 1');
    if (rows.length === 0) {
      return res.status(404).json({ message: 'About section not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching home about:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateHomeAbout = async (req: Request, res: Response) => {
  try {
    const { bio } = req.body;
    await pool.query('UPDATE home_about SET bio = ? WHERE id = 1', [bio]);
    res.json({ message: 'About section updated successfully' });
  } catch (error) {
    console.error('Error updating home about:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// --- SKILLS BACKGROUND ---
export const getHomeSkillsBg = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM home_skills_bg WHERE id = 1');
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Skills bg not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching home skills bg:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateHomeSkillsBg = async (req: Request, res: Response) => {
  try {
    const { line1, line2 } = req.body;
    await pool.query(
      'UPDATE home_skills_bg SET line1 = ?, line2 = ? WHERE id = 1',
      [line1, line2]
    );
    res.json({ message: 'Skills background updated successfully' });
  } catch (error) {
    console.error('Error updating home skills bg:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
