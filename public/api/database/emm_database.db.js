
// Browser-compatible database API endpoint
const STORAGE_KEY = 'emm_sqlite_db';

// Default data structure
const defaultData = {
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

// Simulate localStorage for the API
let dbData = null;

function getStoredData() {
  if (dbData === null) {
    try {
      // Try to get from localStorage if available
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY);
        dbData = stored ? JSON.parse(stored) : { ...defaultData };
      } else {
        dbData = { ...defaultData };
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
      dbData = { ...defaultData };
    }
  }
  return dbData;
}

function saveStoredData(data) {
  dbData = data;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

// This will be called by the browser when accessing the endpoint
if (typeof window !== 'undefined') {
  // Browser environment - intercept fetch requests
  const originalFetch = window.fetch;
  
  window.fetch = function(url, options = {}) {
    if (typeof url === 'string' && url.includes('/api/database/emm_database.db.js')) {
      console.log('🗄️ Intercepted database API request:', options.method, url);
      
      const method = options.method || 'GET';
      const body = options.body || '';
      
      const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      };
      
      if (method === 'OPTIONS') {
        return Promise.resolve(new Response(null, { status: 200, headers }));
      }
      
      if (method === 'GET') {
        const data = getStoredData();
        console.log('✅ SQLite GET response:', data);
        return Promise.resolve(new Response(JSON.stringify(data), { status: 200, headers }));
      }
      
      if (method === 'POST') {
        try {
          const requestData = JSON.parse(body);
          const { action, item, member, id } = requestData;
          const data = getStoredData();
          
          if (action === 'add_media' && item) {
            data.media_items = data.media_items || [];
            data.media_items.push(item);
            data.last_updated = new Date().toISOString();
            data.version++;
            
            saveStoredData(data);
            console.log('✅ Added media item to SQLite:', item.id);
            return Promise.resolve(new Response(JSON.stringify({ success: true, id: item.id }), { status: 200, headers }));
          }
          
          if (action === 'delete_media' && id) {
            data.media_items = data.media_items.filter(mediaItem => mediaItem.id !== id);
            data.last_updated = new Date().toISOString();
            data.version++;
            
            saveStoredData(data);
            console.log('✅ Deleted media item from SQLite:', id);
            return Promise.resolve(new Response(JSON.stringify({ success: true }), { status: 200, headers }));
          }
          
          if (action === 'add_member' && member) {
            data.members = data.members || [];
            data.members.push(member);
            data.last_updated = new Date().toISOString();
            data.version++;
            
            saveStoredData(data);
            console.log('✅ Added member to SQLite:', member.id);
            return Promise.resolve(new Response(JSON.stringify({ success: true, id: member.id }), { status: 200, headers }));
          }
          
          return Promise.resolve(new Response(JSON.stringify({ error: 'Invalid action or missing data' }), { status: 400, headers }));
        } catch (error) {
          console.error('❌ Error parsing POST data:', error);
          return Promise.resolve(new Response(JSON.stringify({ error: 'Invalid JSON data' }), { status: 400, headers }));
        }
      }
      
      return Promise.resolve(new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers }));
    }
    
    // For all other requests, use the original fetch
    return originalFetch.apply(this, arguments);
  };
  
  console.log('🗄️ Database API loaded and fetch interceptor installed');
}
