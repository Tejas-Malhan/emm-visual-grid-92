
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database file path
const DB_PATH = join(__dirname, '../../data/emm_database.db');

// Ensure data directory exists
const dataDir = dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize SQLite database
const db = new sqlite3.Database(DB_PATH);

// Create tables if they don't exist
db.serialize(() => {
  // Media items table
  db.run(`
    CREATE TABLE IF NOT EXISTS media_items (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      cover_url TEXT NOT NULL,
      media_urls TEXT NOT NULL,
      description TEXT NOT NULL,
      credits TEXT NOT NULL,
      uploaded_at TEXT NOT NULL
    )
  `);

  // Members table
  db.run(`
    CREATE TABLE IF NOT EXISTS members (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      default_credit_name TEXT,
      role TEXT NOT NULL,
      instagram_handle TEXT,
      created_at TEXT NOT NULL
    )
  `);

  // Insert default admin user if not exists
  db.run(`
    INSERT OR IGNORE INTO members (id, username, password_hash, default_credit_name, role, created_at)
    VALUES ('admin-1', 'admin', 'admin', 'Admin', 'admin', datetime('now'))
  `);

  // Insert default media items if empty
  db.get("SELECT COUNT(*) as count FROM media_items", (err, row) => {
    if (!err && row.count === 0) {
      const defaultItems = [
        {
          id: 'photo-1',
          type: 'photo',
          cover_url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop',
          media_urls: JSON.stringify([
            'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop'
          ]),
          description: 'Professional portrait session',
          credits: JSON.stringify(['Emma Martinez', 'Michael Chen']),
          uploaded_at: new Date().toISOString()
        },
        {
          id: 'video-1',
          type: 'video',
          cover_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=600&fit=crop',
          media_urls: JSON.stringify(['https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4']),
          description: 'Creative video showcase',
          credits: JSON.stringify(['Sarah Johnson']),
          uploaded_at: new Date().toISOString()
        }
      ];

      defaultItems.forEach(item => {
        db.run(`
          INSERT INTO media_items (id, type, cover_url, media_urls, description, credits, uploaded_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [item.id, item.type, item.cover_url, item.media_urls, item.description, item.credits, item.uploaded_at]);
      });
    }
  });
});

export default function handler(req, res) {
  console.log('🗄️ SQLite Database API Request:', req.method, req.url);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method === 'GET') {
    // Get all data
    const mediaItems = [];
    const members = [];
    
    db.all("SELECT * FROM media_items", (err, rows) => {
      if (err) {
        console.error('❌ Error fetching media items:', err);
        res.status(500).json({ error: 'Database error' });
        return;
      }
      
      rows.forEach(row => {
        mediaItems.push({
          id: row.id,
          type: row.type,
          cover_url: row.cover_url,
          media_urls: JSON.parse(row.media_urls),
          description: row.description,
          credits: JSON.parse(row.credits),
          uploaded_at: row.uploaded_at
        });
      });
      
      db.all("SELECT * FROM members", (err, rows) => {
        if (err) {
          console.error('❌ Error fetching members:', err);
          res.status(500).json({ error: 'Database error' });
          return;
        }
        
        rows.forEach(row => {
          members.push({
            id: row.id,
            username: row.username,
            password_hash: row.password_hash,
            default_credit_name: row.default_credit_name,
            role: row.role,
            instagram_handle: row.instagram_handle,
            created_at: row.created_at
          });
        });
        
        const response = {
          version: 1,
          last_updated: new Date().toISOString(),
          media_items: mediaItems,
          members: members
        };
        
        console.log('✅ SQLite GET response:', response);
        res.status(200).json(response);
      });
    });
  } 
  else if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const { action, item, member } = data;
        
        if (action === 'add_media' && item) {
          db.run(`
            INSERT INTO media_items (id, type, cover_url, media_urls, description, credits, uploaded_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `, [
            item.id,
            item.type,
            item.cover_url,
            JSON.stringify(item.media_urls),
            item.description,
            JSON.stringify(item.credits),
            item.uploaded_at
          ], function(err) {
            if (err) {
              console.error('❌ Error adding media item:', err);
              res.status(500).json({ error: 'Database error' });
              return;
            }
            console.log('✅ Added media item to SQLite:', item.id);
            res.status(200).json({ success: true, id: item.id });
          });
        }
        else if (action === 'delete_media' && data.id) {
          db.run("DELETE FROM media_items WHERE id = ?", [data.id], function(err) {
            if (err) {
              console.error('❌ Error deleting media item:', err);
              res.status(500).json({ error: 'Database error' });
              return;
            }
            console.log('✅ Deleted media item from SQLite:', data.id);
            res.status(200).json({ success: true });
          });
        }
        else if (action === 'add_member' && member) {
          db.run(`
            INSERT INTO members (id, username, password_hash, default_credit_name, role, instagram_handle, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `, [
            member.id,
            member.username,
            member.password_hash,
            member.default_credit_name,
            member.role,
            member.instagram_handle,
            member.created_at
          ], function(err) {
            if (err) {
              console.error('❌ Error adding member:', err);
              res.status(500).json({ error: 'Database error' });
              return;
            }
            console.log('✅ Added member to SQLite:', member.id);
            res.status(200).json({ success: true, id: member.id });
          });
        }
        else {
          res.status(400).json({ error: 'Invalid action or missing data' });
        }
      } catch (error) {
        console.error('❌ Error parsing POST data:', error);
        res.status(400).json({ error: 'Invalid JSON data' });
      }
    });
  }
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
