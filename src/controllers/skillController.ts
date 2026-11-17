import { Request, Response } from 'express';
import pool from '../config/db';
<<<<<<< HEAD
import { ResultSetHeader, RowDataPacket } from 'mysql2';

// Helper to get image URL from Cloudinary upload
const getImageUrl = (req: Request, file: Express.Multer.File | undefined): string | null => {
  if (!file) return null;
  return file.path; // Cloudinary returns secure public URL in file.path
=======
import { ResultSetHeader } from 'mysql2';

// Helper to get image URL depending on environment
const getImageUrl = (req: Request, file: Express.Multer.File | undefined): string | null => {
  if (!file) return null;
  return file.path; // Cloudinary always returns the public URL in file.path
>>>>>>> f8907378845f3b319470419db093cb515a756706
};

export const getAllSkills = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM skills ORDER BY category ASC, sort_order ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching skills', error });
  }
};

export const createSkill = async (req: Request, res: Response) => {
  try {
    const { name, category, sort_order } = req.body;
<<<<<<< HEAD
    let icon = req.body.icon;

    if (req.file) {
      icon = getImageUrl(req, req.file);
    } else if (icon === '' || icon === 'null' || icon === 'undefined') {
      icon = null;
    }

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO skills (name, icon, category, sort_order) VALUES (?, ?, ?, ?)',
      [name?.trim(), icon, category?.trim() || 'Tools', sort_order || 0]
=======
    let icon = req.body.icon; // might be passed as string if no file uploaded
    
    if (req.file) {
      icon = getImageUrl(req, req.file);
    }
    
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO skills (name, icon, category, sort_order) VALUES (?, ?, ?, ?)',
      [name, icon, category, sort_order || 0]
>>>>>>> f8907378845f3b319470419db093cb515a756706
    );

    res.status(201).json({ message: 'Skill created successfully', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating skill', error });
  }
};

export const updateSkill = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, category, sort_order } = req.body;
<<<<<<< HEAD

    const [existing] = await pool.query<RowDataPacket[]>('SELECT * FROM skills WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    const current = existing[0];

    let icon = current.icon;
    if (req.file) {
      icon = getImageUrl(req, req.file);
    } else if (req.body.icon !== undefined) {
      if (req.body.icon === '' || req.body.icon === 'null') {
        icon = null;
      } else if (req.body.icon !== 'undefined') {
        icon = req.body.icon;
      }
    }

    const finalName = name !== undefined ? name.trim() : current.name;
    const finalCategory = category !== undefined ? category.trim() : current.category;
    const finalSortOrder = sort_order !== undefined ? Number(sort_order) : current.sort_order;

    await pool.query<ResultSetHeader>(
      'UPDATE skills SET name=?, icon=?, category=?, sort_order=? WHERE id=?',
      [finalName, icon, finalCategory, finalSortOrder, id]
    );

=======
    let icon = req.body.icon;

    if (req.file) {
      icon = getImageUrl(req, req.file);
    }

    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE skills SET name=?, icon=?, category=?, sort_order=? WHERE id=?',
      [name, icon, category, sort_order || 0, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Skill not found' });
    }

>>>>>>> f8907378845f3b319470419db093cb515a756706
    res.json({ message: 'Skill updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating skill', error });
  }
};

export const deleteSkill = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM skills WHERE id = ?', [id]);
<<<<<<< HEAD

=======
    
>>>>>>> f8907378845f3b319470419db093cb515a756706
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting skill', error });
  }
};
