import { Request, Response } from 'express';
import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const getSiteSettings = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM site_settings WHERE id = 1');
    if (rows.length === 0) {
      return res.json({
        id: 1,
        owner_name: 'Your Name',
        first_name: 'YOUR',
        last_name: 'NAME',
        brand_text: 'PORTFOLIO WORKS',
        location: 'City, Country',
        contact_email: 'hello@example.com',
        badge_text: 'Creative Developer • Engineer • ',
        meta_title: 'Portfolio',
        meta_description: 'Personal portfolio and showcase of projects',
        instagram: '',
        linkedin: '',
        github: '',
        whatsapp: '',
        behance: '',
        dribbble: ''
      });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching site settings', error });
  }
};

export const updateSiteSettings = async (req: Request, res: Response) => {
  try {
    const {
      owner_name,
      first_name,
      last_name,
      brand_text,
      location,
      contact_email,
      badge_text,
      meta_title,
      meta_description,
      instagram,
      linkedin,
      github,
      whatsapp,
      behance,
      dribbble
    } = req.body;

    const [rows] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM site_settings WHERE id = 1');
    if (rows[0].count === 0) {
      await pool.query<ResultSetHeader>(
        `INSERT INTO site_settings (
          id, owner_name, first_name, last_name, brand_text, location, contact_email,
          badge_text, meta_title, meta_description, instagram, linkedin, github, whatsapp, behance, dribbble
        ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          owner_name ?? '',
          first_name ?? '',
          last_name ?? '',
          brand_text ?? '',
          location ?? '',
          contact_email ?? '',
          badge_text ?? '',
          meta_title ?? '',
          meta_description ?? '',
          instagram ?? '',
          linkedin ?? '',
          github ?? '',
          whatsapp ?? '',
          behance ?? '',
          dribbble ?? ''
        ]
      );
    } else {
      await pool.query<ResultSetHeader>(
        `UPDATE site_settings SET
          owner_name = ?,
          first_name = ?,
          last_name = ?,
          brand_text = ?,
          location = ?,
          contact_email = ?,
          badge_text = ?,
          meta_title = ?,
          meta_description = ?,
          instagram = ?,
          linkedin = ?,
          github = ?,
          whatsapp = ?,
          behance = ?,
          dribbble = ?
        WHERE id = 1`,
        [
          owner_name ?? '',
          first_name ?? '',
          last_name ?? '',
          brand_text ?? '',
          location ?? '',
          contact_email ?? '',
          badge_text ?? '',
          meta_title ?? '',
          meta_description ?? '',
          instagram ?? '',
          linkedin ?? '',
          github ?? '',
          whatsapp ?? '',
          behance ?? '',
          dribbble ?? ''
        ]
      );
    }

    const [updated] = await pool.query<RowDataPacket[]>('SELECT * FROM site_settings WHERE id = 1');
    res.json({ message: 'Site settings updated successfully', settings: updated[0] });
  } catch (error) {
    res.status(500).json({ message: 'Error updating site settings', error });
  }
};
