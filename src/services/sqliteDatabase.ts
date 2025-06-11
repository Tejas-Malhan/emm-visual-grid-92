
// SQLite3 Database Service with proper persistence
interface MediaItem {
  id: string;
  type: 'photo' | 'video';
  cover_url: string;
  media_urls: string[];
  description: string;
  credits: string[];
  uploaded_at: string;
}

interface Member {
  id: string;
  username: string;
  password_hash: string;
  default_credit_name: string;
  role: 'admin' | 'member';
  instagram_handle?: string;
  created_at: string;
}

interface Database {
  media_items: MediaItem[];
  members: Member[];
  version: number;
  last_updated: string;
}

class SQLiteDatabaseService {
  private data: Database;
  private readonly DB_API_URL = '/api/database/emm_database.db.js';
  private isInitialized = false;

  constructor() {
    this.data = {
      version: 1,
      last_updated: new Date().toISOString(),
      media_items: [],
      members: []
    };
    this.initialize();
  }

  private async initialize() {
    if (this.isInitialized) return;
    
    console.log('🗄️ Initializing SQLite database system...');
    
    try {
      console.log('📡 Fetching from SQLite database API...');
      const response = await fetch(this.DB_API_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📡 SQLite API Response status:', response.status);
      
      if (response.ok) {
        const fileData = await response.json();
        this.data = fileData;
        console.log('✅ Loaded database from SQLite:', this.data);
      } else {
        console.log('⚠️ SQLite API request failed, using default data');
      }
    } catch (error) {
      console.error('❌ Error loading from SQLite API:', error);
    }
    
    this.isInitialized = true;
  }

  // Media Items
  getMediaItems(): MediaItem[] {
    console.log('📖 Getting media items from SQLite:', this.data.media_items);
    return [...(this.data.media_items || [])];
  }

  async addMediaItem(item: Omit<MediaItem, 'id' | 'uploaded_at'>): Promise<MediaItem> {
    const newItem: MediaItem = {
      ...item,
      id: `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      uploaded_at: new Date().toISOString()
    };
    
    console.log('➕ Adding new media item to SQLite:', newItem);
    
    try {
      const response = await fetch(this.DB_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          action: 'add_media',
          item: newItem
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Media item added to SQLite successfully:', result);
        
        // Update local cache
        this.data.media_items = this.data.media_items || [];
        this.data.media_items.push(newItem);
        
        return newItem;
      } else {
        console.error('❌ Failed to add media item to SQLite:', response.status);
        throw new Error('Failed to add media item');
      }
    } catch (error) {
      console.error('❌ Error adding media item to SQLite:', error);
      throw error;
    }
  }

  async deleteMediaItem(id: string): Promise<boolean> {
    console.log('🗑️ Deleting media item from SQLite:', id);
    
    try {
      const response = await fetch(this.DB_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          action: 'delete_media',
          id: id
        })
      });

      if (response.ok) {
        console.log('✅ Media item deleted from SQLite successfully');
        
        // Update local cache
        this.data.media_items = this.data.media_items.filter(item => item.id !== id);
        
        return true;
      } else {
        console.error('❌ Failed to delete media item from SQLite:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ Error deleting media item from SQLite:', error);
      return false;
    }
  }

  // Members
  getMembers(): Member[] {
    return [...(this.data.members || [])];
  }

  async addMember(member: Omit<Member, 'id' | 'created_at'>): Promise<Member> {
    const newMember: Member = {
      ...member,
      id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString()
    };
    
    console.log('➕ Adding new member to SQLite:', newMember);
    
    try {
      const response = await fetch(this.DB_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          action: 'add_member',
          member: newMember
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Member added to SQLite successfully:', result);
        
        // Update local cache
        this.data.members = this.data.members || [];
        this.data.members.push(newMember);
        
        return newMember;
      } else {
        console.error('❌ Failed to add member to SQLite:', response.status);
        throw new Error('Failed to add member');
      }
    } catch (error) {
      console.error('❌ Error adding member to SQLite:', error);
      throw error;
    }
  }

  authenticateUser(username: string, password: string): Member | null {
    const user = this.data.members?.find(m => 
      m.username === username && m.password_hash === password
    );
    console.log('🔐 SQLite authentication for:', username, user ? 'SUCCESS' : 'FAILED');
    return user || null;
  }

  // Force reload from database
  async reloadFromStorage() {
    this.isInitialized = false;
    await this.initialize();
  }

  getDatabaseStats() {
    return {
      mediaItems: this.data.media_items?.length || 0,
      members: this.data.members?.length || 0,
      version: this.data.version,
      lastUpdated: this.data.last_updated
    };
  }
}

export const sqliteDb = new SQLiteDatabaseService();
export type { MediaItem, Member };
