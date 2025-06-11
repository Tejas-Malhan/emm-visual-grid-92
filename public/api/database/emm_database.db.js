
// Simple database file handler
let databaseData = {
  version: 1,
  last_updated: new Date().toISOString(),
  media_items: [
    {
      id: 'default-1',
      type: 'photo',
      cover_url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop',
      media_urls: [
        'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop'
      ],
      description: 'Professional portrait session capturing authentic moments',
      credits: ['Emma Martinez', 'Michael Chen'],
      uploaded_at: new Date().toISOString()
    },
    {
      id: 'default-2',
      type: 'video',
      cover_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=600&fit=crop',
      media_urls: ['https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'],
      description: 'Creative video production showcase',
      credits: ['Sarah Johnson'],
      uploaded_at: new Date().toISOString()
    }
  ],
  members: [
    {
      id: 'admin-1',
      username: 'admin',
      password_hash: 'team23',
      default_credit_name: 'Admin',
      role: 'admin',
      created_at: new Date().toISOString()
    }
  ]
};

// Handle requests
if (typeof window !== 'undefined') {
  // Browser environment - export for static serving
  window.databaseHandler = {
    GET: () => databaseData,
    POST: (data) => {
      databaseData = data;
      console.log('Database updated:', databaseData);
      return { success: true };
    }
  };
} else {
  // Node environment - export handler function
  module.exports = function handler(req, res) {
    if (req.method === 'GET') {
      res.status(200).json(databaseData);
    } else if (req.method === 'POST') {
      databaseData = req.body;
      console.log('Database saved:', databaseData);
      res.status(200).json({ success: true, message: 'Database saved' });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  };
}
