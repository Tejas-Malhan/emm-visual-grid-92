
// Simple API endpoint for database file operations
// This will be served by the static server

let databaseData = null;

// Handle database requests
export default function handler(req, res) {
  const method = req.method;
  
  if (method === 'GET') {
    // Return current database data
    if (databaseData) {
      res.status(200).json(databaseData);
    } else {
      res.status(404).json({ error: 'Database file not found' });
    }
  } else if (method === 'POST') {
    // Save database data
    try {
      databaseData = req.body;
      console.log('Database saved:', databaseData);
      res.status(200).json({ success: true, message: 'Database saved' });
    } catch (error) {
      console.error('Error saving database:', error);
      res.status(500).json({ error: 'Failed to save database' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
