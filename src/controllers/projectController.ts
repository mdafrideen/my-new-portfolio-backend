import { Request, Response } from 'express';
import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Helper to get image URL depending on environment
const getImageUrl = (req: Request, file: Express.Multer.File | undefined): string | null => {
  if (!file) return null;
  return file.path; // Cloudinary always returns the public URL in file.path
};

export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error });
  }
};

export const getProjectBySlug = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM projects WHERE slug = ?', [req.params.slug]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project', error });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const { title, slug, description, long_description, tags, live_url, github_url, featured, sort_order } = req.body;
    
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const thumbnailFile = files?.thumbnail ? files.thumbnail[0] : req.file;
    const thumbnail = getImageUrl(req, thumbnailFile);

    const imageFiles = files?.images || [];
    const imageUrls = imageFiles.map(f => getImageUrl(req, f)).filter(Boolean) as string[];
    const images = JSON.stringify(imageUrls);

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO projects 
      (title, slug, description, long_description, thumbnail, images, tags, live_url, github_url, featured, sort_order) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, slug, description, long_description, thumbnail, images, tags, live_url, github_url, featured === 'true' || featured === true, sort_order || 0]
    );

    res.status(201).json({ message: 'Project created successfully', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating project', error });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, slug, description, long_description, tags, live_url, github_url, featured, sort_order, existing_images } = req.body;
    
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const thumbnailFile = files?.thumbnail ? files.thumbnail[0] : req.file;
    const thumbnail = getImageUrl(req, thumbnailFile);

    // Validate and process images
    let finalImagesJson: string | undefined = undefined;

    if (existing_images !== undefined) {
      let existingArray: string[] = [];
      try {
        const parsed = typeof existing_images === 'string' ? JSON.parse(existing_images) : existing_images;
        if (!Array.isArray(parsed) || !parsed.every(url => typeof url === 'string' && /^https?:\/\//i.test(url))) {
          return res.status(400).json({ message: 'existing_images must be an array of http(s) URLs' });
        }
        existingArray = parsed;
      } catch {
        return res.status(400).json({ message: 'Invalid JSON for existing_images' });
      }

      const newUploadedUrls = (files?.images || []).map(f => getImageUrl(req, f)).filter(Boolean) as string[];
      finalImagesJson = JSON.stringify([...existingArray, ...newUploadedUrls]);
    } else if (files?.images && files.images.length > 0) {
      // If existing_images is absent but new images are uploaded, fetch current images and append
      const [currentRows] = await pool.query<RowDataPacket[]>('SELECT images FROM projects WHERE id = ?', [id]);
      let currentImages: string[] = [];
      if (currentRows.length > 0 && currentRows[0].images) {
        try {
          const parsed = JSON.parse(currentRows[0].images);
          if (Array.isArray(parsed)) currentImages = parsed;
        } catch {
          // ignore JSON parse error on malformed column
        }
      }
      const newUploadedUrls = files.images.map(f => getImageUrl(req, f)).filter(Boolean) as string[];
      finalImagesJson = JSON.stringify([...currentImages, ...newUploadedUrls]);
    }
    // If existing_images is absent AND no new images are uploaded, do NOT touch the images column.

    const updateFields: string[] = [
      'title = ?',
      'slug = ?',
      'description = ?',
      'long_description = ?',
      'tags = ?',
      'live_url = ?',
      'github_url = ?',
      'featured = ?',
      'sort_order = ?'
    ];
    const queryParams: any[] = [
      title,
      slug,
      description,
      long_description,
      tags,
      live_url,
      github_url,
      featured === 'true' || featured === true,
      sort_order || 0
    ];

    if (thumbnail) {
      updateFields.push('thumbnail = ?');
      queryParams.push(thumbnail);
    }

    if (finalImagesJson !== undefined) {
      updateFields.push('images = ?');
      queryParams.push(finalImagesJson);
    }

    queryParams.push(id);
    const updateQuery = `UPDATE projects SET ${updateFields.join(', ')} WHERE id = ?`;

    const [result] = await pool.query<ResultSetHeader>(updateQuery, queryParams);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating project', error });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM projects WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project', error });
  }
};
