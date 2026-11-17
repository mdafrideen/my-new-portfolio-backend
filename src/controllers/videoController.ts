import { Request, Response } from 'express';
import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const normalizeRatio = (ratio: string): string => {
  const trimmed = (ratio || '').trim();
  if (trimmed.toUpperCase() === 'A4') return 'A4';
  return trimmed;
};

const isValidRatio = (ratio: string): boolean => {
  const norm = normalizeRatio(ratio);
  if (norm === 'A4') return true;
  return /^\d+(\.\d+)?:\d+(\.\d+)?$/.test(norm);
};

const isValidHttpUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim().toLowerCase();
  return trimmed.startsWith('http://') || trimmed.startsWith('https://');
};

const getImageUrl = (file: Express.Multer.File | undefined): string | null => {
  if (!file) return null;
  return file.path; // Cloudinary returns public URL in file.path
};

export const getAllVideoWorks = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM video_works ORDER BY sort_order ASC, created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching video works:', error);
    res.status(500).json({ message: 'Error fetching video works', error });
  }
};

export const createVideoWork = async (req: Request, res: Response) => {
  try {
    const { title, ratio, video_url, label, sort_order } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    if (!ratio || !isValidRatio(ratio)) {
      return res.status(400).json({
        message: 'Ratio must be in "W:H" format (e.g. "9:16", "16:9") or "A4"',
      });
    }

    if (!video_url || !isValidHttpUrl(video_url)) {
      return res.status(400).json({
        message: 'Video URL must be a valid link starting with http:// or https://',
      });
    }

    const thumbnail = getImageUrl(req.file);
    if (!thumbnail) {
      return res.status(400).json({ message: 'Thumbnail image is required' });
    }

    const normalizedRatio = normalizeRatio(ratio);

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO video_works (title, ratio, thumbnail, video_url, label, sort_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        normalizedRatio,
        thumbnail,
        video_url.trim(),
        label ? label.trim() : '',
        sort_order !== undefined && sort_order !== '' ? Number(sort_order) : 0,
      ]
    );

    const [newWork] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM video_works WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Video work created successfully',
      work: newWork[0],
    });
  } catch (error) {
    console.error('Error creating video work:', error);
    res.status(500).json({ message: 'Error creating video work', error });
  }
};

export const updateVideoWork = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, ratio, video_url, label, sort_order } = req.body;

    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM video_works WHERE id = ?',
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Video work not found' });
    }

    const currentWork = existing[0];

    const finalTitle = title !== undefined ? title.trim() : currentWork.title;
    if (!finalTitle) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const rawRatio = ratio !== undefined ? ratio : currentWork.ratio;
    if (!rawRatio || !isValidRatio(rawRatio)) {
      return res.status(400).json({
        message: 'Ratio must be in "W:H" format (e.g. "9:16", "16:9") or "A4"',
      });
    }
    const finalRatio = normalizeRatio(rawRatio);

    const rawUrl = video_url !== undefined ? video_url : currentWork.video_url;
    if (!rawUrl || !isValidHttpUrl(rawUrl)) {
      return res.status(400).json({
        message: 'Video URL must be a valid link starting with http:// or https://',
      });
    }
    const finalUrl = rawUrl.trim();

    const newThumb = getImageUrl(req.file);
    const finalThumbnail = newThumb || currentWork.thumbnail;

    const finalLabel = label !== undefined ? label.trim() : currentWork.label;
    const finalSortOrder =
      sort_order !== undefined && sort_order !== ''
        ? Number(sort_order)
        : currentWork.sort_order;

    await pool.query<ResultSetHeader>(
      `UPDATE video_works SET
         title = ?,
         ratio = ?,
         thumbnail = ?,
         video_url = ?,
         label = ?,
         sort_order = ?
       WHERE id = ?`,
      [finalTitle, finalRatio, finalThumbnail, finalUrl, finalLabel, finalSortOrder, id]
    );

    const [updated] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM video_works WHERE id = ?',
      [id]
    );

    res.json({
      message: 'Video work updated successfully',
      work: updated[0],
    });
  } catch (error) {
    console.error('Error updating video work:', error);
    res.status(500).json({ message: 'Error updating video work', error });
  }
};

export const deleteVideoWork = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM video_works WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Video work not found' });
    }

    res.json({ message: 'Video work deleted successfully' });
  } catch (error) {
    console.error('Error deleting video work:', error);
    res.status(500).json({ message: 'Error deleting video work', error });
  }
};
