import { Request, Response } from 'express';
import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const ALLOWED_CATEGORIES = ['poster', 'carousel', 'certificate', 'banner', 'brochure'] as const;

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

const parseImages = (imagesVal: any): string[] => {
  if (!imagesVal) return [];
  if (Array.isArray(imagesVal)) return imagesVal.filter(Boolean);
  if (typeof imagesVal === 'string') {
    try {
      const parsed = JSON.parse(imagesVal);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
      return [imagesVal];
    } catch {
      return imagesVal ? [imagesVal] : [];
    }
  }
  return [];
};

const getImageUrl = (file: Express.Multer.File | undefined): string | null => {
  if (!file) return null;
  return file.path; // Cloudinary returns public URL in file.path
};

export const getAllGraphicWorks = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      // Ithula query ah 'COALESCE' vachu maathi iruken. Ithu sort_order NULL ah irundhalum, id vachu sort pannum.
      'SELECT * FROM graphic_works ORDER BY COALESCE(sort_order, 0) ASC, id ASC'
    );
    const works = rows.map((work) => ({
      ...work,
      images: parseImages(work.images),
    }));
    res.json(works);
  } catch (error) {
    console.error('Error fetching graphic works:', error);
    res.status(500).json({ message: 'Error fetching graphic works', error });
  }
};

export const createGraphicWork = async (req: Request, res: Response) => {
  try {
    const { title, category, ratio, sort_order } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const cat = (category || '').trim().toLowerCase();
    if (!ALLOWED_CATEGORIES.includes(cat as any)) {
      return res.status(400).json({
        message: `Category must be one of: ${ALLOWED_CATEGORIES.join(', ')}`,
      });
    }

    if (!ratio || !isValidRatio(ratio)) {
      return res.status(400).json({
        message: 'Ratio must be in "W:H" format (e.g. "3:4", "16:9") or "A4"',
      });
    }

    const files = (req.files as Express.Multer.File[]) || [];
    let imageUrls = files.map(getImageUrl).filter(Boolean) as string[];

    if (imageUrls.length === 0) {
      return res.status(400).json({ message: 'At least 1 image is required' });
    }

    // Non-carousel categories keep only the first image
    if (cat !== 'carousel') {
      imageUrls = [imageUrls[0]];
    }

    const normalizedRatio = normalizeRatio(ratio);

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO graphic_works (title, category, ratio, images, sort_order)
       VALUES (?, ?, ?, ?, ?)`,
      [
        title.trim(),
        cat,
        normalizedRatio,
        JSON.stringify(imageUrls),
        sort_order !== undefined && sort_order !== '' ? Number(sort_order) : 0,
      ]
    );

    const [newWork] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM graphic_works WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Graphic work created successfully',
      work: {
        ...newWork[0],
        images: parseImages(newWork[0].images),
      },
    });
  } catch (error) {
    console.error('Error creating graphic work:', error);
    res.status(500).json({ message: 'Error creating graphic work', error });
  }
};

export const updateGraphicWork = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, category, ratio, sort_order, existing_images } = req.body;

    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM graphic_works WHERE id = ?',
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Graphic work not found' });
    }

    const currentWork = existing[0];

    const finalTitle = title !== undefined ? title.trim() : currentWork.title;
    if (!finalTitle) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const finalCategory = (category !== undefined ? category : currentWork.category)
      .trim()
      .toLowerCase();
    if (!ALLOWED_CATEGORIES.includes(finalCategory as any)) {
      return res.status(400).json({
        message: `Category must be one of: ${ALLOWED_CATEGORIES.join(', ')}`,
      });
    }

    const rawRatio = ratio !== undefined ? ratio : currentWork.ratio;
    if (!rawRatio || !isValidRatio(rawRatio)) {
      return res.status(400).json({
        message: 'Ratio must be in "W:H" format (e.g. "3:4", "16:9") or "A4"',
      });
    }
    const finalRatio = normalizeRatio(rawRatio);

    const retainedImages = existing_images !== undefined ? parseImages(existing_images) : parseImages(currentWork.images);
    const files = (req.files as Express.Multer.File[]) || [];
    const newUploadedUrls = files.map(getImageUrl).filter(Boolean) as string[];

    let finalImages = [...retainedImages, ...newUploadedUrls];

    if (finalImages.length === 0) {
      return res.status(400).json({ message: 'At least 1 image is required' });
    }

    if (finalCategory !== 'carousel') {
      finalImages = [finalImages[0]];
    }

    const finalSortOrder =
      sort_order !== undefined && sort_order !== ''
        ? Number(sort_order)
        : currentWork.sort_order;

    await pool.query<ResultSetHeader>(
      `UPDATE graphic_works SET
         title = ?,
         category = ?,
         ratio = ?,
         images = ?,
         sort_order = ?
       WHERE id = ?`,
      [finalTitle, finalCategory, finalRatio, JSON.stringify(finalImages), finalSortOrder, id]
    );

    const [updated] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM graphic_works WHERE id = ?',
      [id]
    );

    res.json({
      message: 'Graphic work updated successfully',
      work: {
        ...updated[0],
        images: parseImages(updated[0].images),
      },
    });
  } catch (error) {
    console.error('Error updating graphic work:', error);
    res.status(500).json({ message: 'Error updating graphic work', error });
  }
};

export const deleteGraphicWork = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM graphic_works WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Graphic work not found' });
    }

    res.json({ message: 'Graphic work deleted successfully' });
  } catch (error) {
    console.error('Error deleting graphic work:', error);
    res.status(500).json({ message: 'Error deleting graphic work', error });
  }
};