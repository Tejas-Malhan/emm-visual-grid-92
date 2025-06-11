
// Proper SQLite3 Database Service with binary .db file
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

interface DatabaseSchema {
  media_items: MediaItem[];
  members: Member[];
  version: number;
  last_updated: string;
}

class SQLite3DatabaseService {
  private readonly DB_API_URL = '/api/sqlite3/emm.db';
  private cache: DatabaseSchema | null = null;
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    if (this.isInitialized) return;
    
    console.log('🗄️ Initializing SQLite3 database...');
    
    try {
      const response = await fetch(this.DB_API_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📡 SQLite3 Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        this.cache = data;
        console.log('✅ SQLite3 database loaded:', this.cache);
      } else {
        console.log('⚠️ SQLite3 API failed, initializing default data');
        await this.initializeDefaultData();
      }
    } catch (error) {
      console.error('❌ Error loading SQLite3 database:', error);
      await this.initializeDefaultData();
    }
    
    this.isInitialized = true;
  }

  private async initializeDefaultData() {
    const defaultData: DatabaseSchema = {
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

    await this.saveToDatabase(defaultData);
    this.cache = defaultData;
  }

  private async saveToDatabase(data: DatabaseSchema): Promise<void> {
    try {
      const response = await fetch(this.DB_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          action: 'save_database',
          data: data
        })
      });

      if (!response.ok) {
        throw new Error(`SQLite3 save failed: ${response.status}`);
      }

      console.log('✅ SQLite3 database saved successfully');
    } catch (error) {
      console.error('❌ Error saving to SQLite3 database:', error);
      throw error;
    }
  }

  // Media Items
  getMediaItems(): MediaItem[] {
    return this.cache?.media_items || [];
  }

  getPhotoItems(): MediaItem[] {
    return this.getMediaItems().filter(item => item.type === 'photo');
  }

  getVideoItems(): MediaItem[] {
    return this.getMediaItems().filter(item => item.type === 'video');
  }

  async addMediaItem(item: Omit<MediaItem, 'id' | 'uploaded_at'>): Promise<MediaItem> {
    await this.initialize();
    
    const newItem: MediaItem = {
      ...item,
      id: `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      uploaded_at: new Date().toISOString()
    };
    
    console.log('➕ Adding media item to SQLite3:', newItem);
    
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
        console.log('✅ Media item added to SQLite3:', result);
        
        // Update cache
        if (this.cache) {
          this.cache.media_items.push(newItem);
          this.cache.last_updated = new Date().toISOString();
          this.cache.version++;
        }
        
        return newItem;
      } else {
        throw new Error(`Failed to add media item: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error adding media item to SQLite3:', error);
      throw error;
    }
  }

  async deleteMediaItem(id: string): Promise<boolean> {
    await this.initialize();
    
    console.log('🗑️ Deleting media item from SQLite3:', id);
    
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
        console.log('✅ Media item deleted from SQLite3');
        
        // Update cache
        if (this.cache) {
          this.cache.media_items = this.cache.media_items.filter(item => item.id !== id);
          this.cache.last_updated = new Date().toISOString();
          this.cache.version++;
        }
        
        return true;
      } else {
        console.error('❌ Failed to delete media item from SQLite3:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ Error deleting media item from SQLite3:', error);
      return false;
    }
  }

  // Members
  getMembers(): Member[] {
    return this.cache?.members || [];
  }

  async addMember(member: Omit<Member, 'id' | 'created_at'>): Promise<Member> {
    await this.initialize();
    
    const newMember: Member = {
      ...member,
      id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString()
    };
    
    console.log('👤 Adding member to SQLite3:', newMember);
    
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
        console.log('✅ Member added to SQLite3:', result);
        
        // Update cache
        if (this.cache) {
          this.cache.members.push(newMember);
          this.cache.last_updated = new Date().toISOString();
          this.cache.version++;
        }
        
        return newMember;
      } else {
        const errorData = await response.json();
        throw new Error(`Failed to add member: ${errorData.error || response.status}`);
      }
    } catch (error) {
      console.error('❌ Error adding member to SQLite3:', error);
      throw error;
    }
  }

  authenticateUser(username: string, password: string): Member | null {
    const user = this.getMembers().find(m => 
      m.username === username && m.password_hash === password
    );
    console.log('🔐 SQLite3 authentication for:', username, user ? 'SUCCESS' : 'FAILED');
    return user || null;
  }

  // Force reload from database
  async reloadFromDatabase() {
    this.cache = null;
    this.isInitialized = false;
    await this.initialize();
  }

  getDatabaseStats() {
    return {
      mediaItems: this.getMediaItems().length,
      photoItems: this.getPhotoItems().length,
      videoItems: this.getVideoItems().length,
      members: this.getMembers().length,
      version: this.cache?.version || 0,
      lastUpdated: this.cache?.last_updated || 'Never'
    };
  }
}

export const sqlite3Db = new SQLite3DatabaseService();
export type { MediaItem, Member };
