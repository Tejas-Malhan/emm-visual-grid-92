
// Main database service that uses SQLite3 implementation
export { sqlite3Db as db, type MediaItem, type Member } from './sqlite3Database';

// Initialize database on module load
import { sqlite3Db } from './sqlite3Database';

// Auto-initialize the database when the module loads
sqlite3Db.initializeDatabase().catch(error => {
  console.warn('Database auto-initialization failed:', error);
});
