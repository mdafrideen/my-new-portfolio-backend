import { Request, Response } from 'express';
import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
<<<<<<< HEAD
import https from 'https';
import http from 'http';
import { getEffectiveSmtpConfig, createSmtpTransporter } from '../utils/mailer';
=======
>>>>>>> f8907378845f3b319470419db093cb515a756706

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
<<<<<<< HEAD
        dribbble: '',
        resume_url: '',
        smtp_host: '',
        smtp_port: '587',
        smtp_secure: false,
        smtp_user: '',
        smtp_pass: '',
        smtp_from_email: '',
        notification_email: '',
=======
        dribbble: ''
>>>>>>> f8907378845f3b319470419db093cb515a756706
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
<<<<<<< HEAD
      dribbble,
      resume_url,
      smtp_host,
      smtp_port,
      smtp_secure,
      smtp_user,
      smtp_pass,
      smtp_from_email,
      notification_email,
    } = req.body;

    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM site_settings WHERE id = 1');
    const existing = rows.length > 0 ? rows[0] : null;

    let finalResumeUrl = existing ? existing.resume_url : '';
    if (req.file) {
      finalResumeUrl = req.file.path;
    } else if (resume_url !== undefined) {
      finalResumeUrl = resume_url;
    }

    if (!existing) {
      await pool.query<ResultSetHeader>(
        `INSERT INTO site_settings (
          id, owner_name, first_name, last_name, brand_text, location, contact_email,
          badge_text, meta_title, meta_description, instagram, linkedin, github, whatsapp, behance, dribbble, resume_url,
          smtp_host, smtp_port, smtp_secure, smtp_user, smtp_pass, smtp_from_email, notification_email
        ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
=======
      dribbble
    } = req.body;

    const [rows] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM site_settings WHERE id = 1');
    if (rows[0].count === 0) {
      await pool.query<ResultSetHeader>(
        `INSERT INTO site_settings (
          id, owner_name, first_name, last_name, brand_text, location, contact_email,
          badge_text, meta_title, meta_description, instagram, linkedin, github, whatsapp, behance, dribbble
        ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
>>>>>>> f8907378845f3b319470419db093cb515a756706
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
<<<<<<< HEAD
          dribbble ?? '',
          finalResumeUrl ?? '',
          smtp_host ?? '',
          smtp_port ?? '587',
          smtp_secure ? 1 : 0,
          smtp_user ?? '',
          smtp_pass ?? '',
          smtp_from_email ?? '',
          notification_email ?? '',
=======
          dribbble ?? ''
>>>>>>> f8907378845f3b319470419db093cb515a756706
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
<<<<<<< HEAD
          dribbble = ?,
          resume_url = ?,
          smtp_host = ?,
          smtp_port = ?,
          smtp_secure = ?,
          smtp_user = ?,
          smtp_pass = ?,
          smtp_from_email = ?,
          notification_email = ?
        WHERE id = 1`,
        [
          owner_name ?? existing.owner_name,
          first_name ?? existing.first_name,
          last_name ?? existing.last_name,
          brand_text ?? existing.brand_text,
          location ?? existing.location,
          contact_email ?? existing.contact_email,
          badge_text ?? existing.badge_text,
          meta_title ?? existing.meta_title,
          meta_description ?? existing.meta_description,
          instagram ?? existing.instagram,
          linkedin ?? existing.linkedin,
          github ?? existing.github,
          whatsapp ?? existing.whatsapp,
          behance ?? existing.behance,
          dribbble ?? existing.dribbble,
          finalResumeUrl ?? '',
          smtp_host !== undefined ? smtp_host : existing.smtp_host ?? '',
          smtp_port !== undefined ? smtp_port : existing.smtp_port ?? '587',
          smtp_secure !== undefined ? (smtp_secure ? 1 : 0) : existing.smtp_secure ?? 0,
          smtp_user !== undefined ? smtp_user : existing.smtp_user ?? '',
          smtp_pass !== undefined ? smtp_pass : existing.smtp_pass ?? '',
          smtp_from_email !== undefined ? smtp_from_email : existing.smtp_from_email ?? '',
          notification_email !== undefined ? notification_email : existing.notification_email ?? '',
=======
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
>>>>>>> f8907378845f3b319470419db093cb515a756706
        ]
      );
    }

    const [updated] = await pool.query<RowDataPacket[]>('SELECT * FROM site_settings WHERE id = 1');
    res.json({ message: 'Site settings updated successfully', settings: updated[0] });
  } catch (error) {
<<<<<<< HEAD
    console.error('Error updating site settings:', error);
    res.status(500).json({ message: 'Error updating site settings', error });
  }
};

export const testSmtpConnection = async (req: Request, res: Response) => {
  try {
    const config = await getEffectiveSmtpConfig();
    if (!config) {
      return res.status(400).json({
        message: 'SMTP credentials not configured. Please enter your SMTP Username and Password.'
      });
    }

    const transporter = createSmtpTransporter(config);
    await transporter.verify();

    await transporter.sendMail({
      from: `"${config.from || 'Portfolio'}" <${config.user}>`,
      to: config.to,
      subject: '✅ Portfolio SMTP Connection Test Successful',
      text: `Hello,\n\nYour SMTP configuration is working properly!\n\nYou will receive email alerts at this address whenever someone submits the Start Project or Contact form on your portfolio website.\n\nNotification Target: ${config.to}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
          <h2 style="color: #0b4cfc; margin-top: 0;">✅ SMTP Test Successful!</h2>
          <p style="color: #334155; font-size: 15px; line-height: 1.6;">Your portfolio email alert system is connected and working properly.</p>
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0b4cfc;">
            <p style="margin: 4px 0; font-size: 14px; color: #1e293b;"><strong>Host:</strong> ${config.host}</p>
            <p style="margin: 4px 0; font-size: 14px; color: #1e293b;"><strong>Port:</strong> ${config.port} (${config.secure ? 'SSL' : 'TLS'})</p>
            <p style="margin: 4px 0; font-size: 14px; color: #1e293b;"><strong>User:</strong> ${config.user}</p>
            <p style="margin: 4px 0; font-size: 14px; color: #1e293b;"><strong>Recipient:</strong> ${config.to}</p>
          </div>
          <p style="color: #64748b; font-size: 13px;">When a client submits the Start Project form on your website, you will receive their details instantly.</p>
        </div>
      `,
    });

    res.json({ message: `Test email sent successfully to ${config.to}! Please check your inbox (and spam folder).` });
  } catch (error: any) {
    console.error('SMTP test error:', error);
    res.status(500).json({
      message: `SMTP test failed: ${error?.message || 'Connection error'}. Please check host, port, username, and password.`
    });
  }
};

export const uploadResumeFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const resumeUrl = req.file.path; // Cloudinary secure raw URL
    await pool.query('UPDATE site_settings SET resume_url = ? WHERE id = 1', [resumeUrl]);
    res.json({ message: 'Resume uploaded successfully', resume_url: resumeUrl });
  } catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).json({ message: 'Error uploading resume', error });
  }
};

export const downloadResume = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT resume_url, owner_name FROM site_settings WHERE id = 1');
    if (rows.length === 0 || !rows[0].resume_url) {
      return res.status(404).json({ message: 'No resume available' });
    }
    const resumeUrl = rows[0].resume_url;
    const owner = (rows[0].owner_name || 'Mohamed_Afrideen').replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${owner}_Resume.pdf`;

    const client = resumeUrl.startsWith('https') ? https : http;
    client.get(resumeUrl, (cloudRes) => {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      cloudRes.pipe(res);
    }).on('error', (err) => {
      console.error('Error streaming resume from Cloudinary:', err);
      res.redirect(resumeUrl);
    });
  } catch (error) {
    console.error('Error downloading resume:', error);
    res.status(500).json({ message: 'Error downloading resume', error });
  }
};
=======
    res.status(500).json({ message: 'Error updating site settings', error });
  }
};
>>>>>>> f8907378845f3b319470419db093cb515a756706
