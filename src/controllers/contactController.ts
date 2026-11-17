import { Request, Response } from 'express';
import pool from '../config/db';
import { ResultSetHeader } from 'mysql2';
import { sendProjectInquiryEmail } from '../utils/mailer';

export const submitContactForm = async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    // Save to DB
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)',
      [name, email, message]
    );

    // Send email alert to admin asynchronously
    sendProjectInquiryEmail({ name, email, message }).catch((mailError) => {
      console.error('Failed to send email alert:', mailError);
    });

    res.status(201).json({ message: 'Message sent successfully', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting message', error });
  }
};

export const getAllMessages = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error });
  }
};

export const markMessageAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query<ResultSetHeader>('UPDATE messages SET is_read = TRUE WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({ message: 'Message marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating message', error });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM messages WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting message', error });
  }
};
