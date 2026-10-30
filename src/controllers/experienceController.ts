import { Request, Response } from 'express';
import pool from '../config/db';
import { ResultSetHeader } from 'mysql2';

export const getAllExperience = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM experience ORDER BY sort_order ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching experience', error });
  }
};

export const createExperience = async (req: Request, res: Response) => {
  try {
    const { company, role, duration, description, is_current, sort_order } = req.body;
    
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO experience (company, role, duration, description, is_current, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      [company, role, duration, description, is_current === 'true' || is_current === true, sort_order || 0]
    );

    res.status(201).json({ message: 'Experience created successfully', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating experience', error });
  }
};

export const updateExperience = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { company, role, duration, description, is_current, sort_order } = req.body;

    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE experience SET company=?, role=?, duration=?, description=?, is_current=?, sort_order=? WHERE id=?',
      [company, role, duration, description, is_current === 'true' || is_current === true, sort_order || 0, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    res.json({ message: 'Experience updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating experience', error });
  }
};

export const deleteExperience = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM experience WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    res.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting experience', error });
  }
};
