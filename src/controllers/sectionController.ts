import { Request, Response } from 'express';
import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface SectionVisibilityRow extends RowDataPacket {
  section_key: string;
  label: string;
  page: string;
  is_visible: boolean | number;
  is_locked: boolean | number;
  sort_order: number;
  updated_at?: string;
}

const formatSectionRow = (row: SectionVisibilityRow) => ({
  section_key: row.section_key,
  label: row.label,
  page: row.page,
  is_visible: Boolean(row.is_visible),
  is_locked: Boolean(row.is_locked),
  sort_order: row.sort_order,
  ...(row.updated_at ? { updated_at: row.updated_at } : {})
});

export const getSectionVisibility = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<SectionVisibilityRow[]>(
      'SELECT section_key, label, page, is_visible, is_locked, sort_order, updated_at FROM section_visibility ORDER BY sort_order ASC'
    );
    const sections = rows.map(formatSectionRow);
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching section visibility', error });
  }
};

export const updateSectionVisibility = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const { is_visible } = req.body;

    if (typeof is_visible !== 'boolean') {
      return res.status(400).json({ message: 'is_visible must be a boolean' });
    }

    const [rows] = await pool.query<SectionVisibilityRow[]>(
      'SELECT section_key, label, page, is_visible, is_locked, sort_order FROM section_visibility WHERE section_key = ?',
      [key]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Section not found' });
    }

    const section = rows[0];

    if (Boolean(section.is_locked) && is_visible === false) {
      return res.status(400).json({ message: 'Cannot hide locked section' });
    }

    await pool.query<ResultSetHeader>(
      'UPDATE section_visibility SET is_visible = ? WHERE section_key = ?',
      [is_visible, key]
    );

    const [updatedRows] = await pool.query<SectionVisibilityRow[]>(
      'SELECT section_key, label, page, is_visible, is_locked, sort_order, updated_at FROM section_visibility WHERE section_key = ?',
      [key]
    );

    res.json(formatSectionRow(updatedRows[0]));
  } catch (error) {
    res.status(500).json({ message: 'Error updating section visibility', error });
  }
};

