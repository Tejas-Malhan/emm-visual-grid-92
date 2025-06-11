
// NEW Database API endpoint - file-based storage only
let currentDatabase = null;

// Handle requests
if (typeof window !== 'undefined') {
  // Browser environment
  window.databaseHandler = {
    GET: () => {
      console.log('🔍 Browser GET request for database:', currentDatabase);
      return currentDatabase;
    },
    POST: (data) => {
      currentDatabase = data;
      console.log('💾 Browser POST - Database updated:', currentDatabase);
      return { success: true };
    }
  };
} else {
  // Node environment - export handler function
  module.exports = function handler(req, res) {
    console.log('🌐 API Request:', req.method);
    
    if (req.method === 'GET') {
      console.log('📖 GET request - returning database:', currentDatabase);
      if (currentDatabase) {
        res.status(200).json(currentDatabase);
      } else {
        res.status(404).json({ error: 'Database not found' });
      }
    } else if (req.method === 'POST') {
      currentDatabase = req.body;
      console.log('💾 POST request - Database saved:', currentDatabase);
      res.status(200).json({ success: true, message: 'Database saved successfully' });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  };
}
