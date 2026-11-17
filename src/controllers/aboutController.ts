import { Request, Response } from 'express';
import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Helper to get image URL depending on environment
const getImageUrl = (req: Request, file: Express.Multer.File | undefined): string | null => {
  if (!file) return null;
  return file.path; // Cloudinary always returns the public URL in file.path
};

export const getAboutContent = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM about_content WHERE id = 1');
    if (rows.length === 0) {
      return res.status(404).json({ message: 'About content not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching about content', error });
  }
};

export const updateAboutContent = async (req: Request, res: Response) => {
  try {
    const { subtitle, location, quote, bio, bio_highlight } = req.body;
    let photo = req.body.photo;
    let gallery_1 = req.body.gallery_1;
    let gallery_2 = req.body.gallery_2;

    // Handle files if uploaded
    if (req.files && !Array.isArray(req.files)) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files.photo) photo = getImageUrl(req, files.photo[0]);
      if (files.gallery_1) {
        gallery_1 = JSON.stringify(files.gallery_1.map(f => getImageUrl(req, f)));
      }
      if (files.gallery_2) {
        gallery_2 = JSON.stringify(files.gallery_2.map(f => getImageUrl(req, f)));
      }
    }

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE about_content SET 
        subtitle=?, location=?, quote=?, bio=?, bio_highlight=?, 
        photo=?, gallery_1=?, gallery_2=?
       WHERE id=1`,
      [subtitle, location, quote, bio, bio_highlight, photo, gallery_1, gallery_2]
    );

    res.json({ message: 'About content updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating about content', error });
  }
};
