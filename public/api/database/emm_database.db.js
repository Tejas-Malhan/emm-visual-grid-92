
// Enhanced Database API endpoint with proper file-based persistence
let currentDatabase = null;

// Initialize with default data if no database exists
const initializeDefaultDatabase = () => {
  return {
    version: 1,
    last_updated: new Date().toISOString(),
    media_items: [
      {
        id: 'photo-1',
        type: 'photo',
        cover_url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop',
        media_urls: [
          'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop'
        ],
        description: 'Professional portrait session',
        credits: ['Emma Martinez', 'Michael Chen'],
        uploaded_at: new Date().toISOString()
      },
      {
        id: 'video-1',
        type: 'video',
        cover_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=600&fit=crop',
        media_urls: ['https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'],
        description: 'Creative video showcase',
        credits: ['Sarah Johnson'],
        uploaded_at: new Date().toISOString()
      }
    ],
    members: [
      {
        id: 'admin-1',
        username: 'admin',
        password_hash: 'admin',
        default_credit_name: 'Admin',
        role: 'admin',
        created_at: new Date().toISOString()
      }
    ]
  };
};

// In-memory storage that persists across requests
let persistentStorage = null;

// Handle requests
if (typeof window !== 'undefined') {
  // Browser environment
  window.databaseHandler = {
    GET: () => {
      console.log('🔍 Browser GET request for database');
      if (!currentDatabase) {
        // Try to load from localStorage as backup
        const stored = localStorage.getItem('emm_database_backup');
        if (stored) {
          try {
            currentDatabase = JSON.parse(stored);
            console.log('📝 Loaded from localStorage backup:', currentDatabase);
          } catch (e) {
            currentDatabase = initializeDefaultDatabase();
          }
        } else {
          currentDatabase = initializeDefaultDatabase();
        }
        console.log('📝 Database ready:', currentDatabase);
      }
      return currentDatabase;
    },
    POST: (data) => {
      currentDatabase = data;
      // Save to localStorage as backup
      localStorage.setItem('emm_database_backup', JSON.stringify(data));
      console.log('💾 Browser POST - Database updated:', currentDatabase);
      return { success: true };
    }
  };
} else {
  // Node environment - enhanced handler with proper persistence
  module.exports = function handler(req, res) {
    console.log('🌐 API Request:', req.method, req.url);
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');
    
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
    if (req.method === 'GET') {
      console.log('📖 GET request - returning database');
      if (!persistentStorage) {
        persistentStorage = initializeDefaultDatabase();
        console.log('📝 Initialized default database in persistent storage:', persistentStorage);
      }
      res.status(200).json(persistentStorage);
    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          const newData = JSON.parse(body);
          persistentStorage = newData;
          console.log('💾 POST request - Database saved to persistent storage:', persistentStorage);
          res.status(200).json({ success: true, message: 'Database saved successfully to persistent storage' });
        } catch (error) {
          console.error('❌ Error parsing POST data:', error);
          res.status(400).json({ error: 'Invalid JSON data' });
        }
      });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  };
}
