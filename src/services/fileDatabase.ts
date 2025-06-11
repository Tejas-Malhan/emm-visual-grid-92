
// Proper file-based database service that persists to actual files
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

// Default data with working image URLs
const defaultDatabase: Database = {
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

class FileDatabaseService {
  private data: Database;
  private dbFileName = 'emm_database.db';

  constructor() {
    this.data = { ...defaultDatabase };
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    try {
      console.log('Initializing file-based database system...');
      
      // Try to load from file first, then localStorage as absolute fallback
      let loaded = false;
      
      // Try file-based storage first
      try {
        const response = await fetch(`/api/database/${this.dbFileName}`);
        if (response.ok) {
          const existingData = await response.json();
          console.log('Loaded database from file:', existingData);
          this.data = existingData;
          loaded = true;
        }
      } catch (fileError) {
        console.log('File database not available, checking localStorage...');
      }

      // Only check localStorage if file loading failed
      if (!loaded) {
        const localData = localStorage.getItem('emm_database_v3');
        if (localData) {
          try {
            this.data = JSON.parse(localData);
            console.log('Loaded database from localStorage backup:', this.data);
            // Try to migrate to file storage
            await this.saveDatabaseFile();
          } catch (e) {
            console.log('localStorage data invalid, using defaults');
          }
        } else {
          console.log('No existing database found, creating new one...');
          await this.saveDatabaseFile();
        }
      }
    } catch (error) {
      console.error('Error initializing database:', error);
      console.log('Using default data');
    }
  }

  private async saveDatabaseFile() {
    try {
      this.data.last_updated = new Date().toISOString();
      this.data.version = (this.data.version || 0) + 1;
      
      console.log('Saving database to file system:', this.data);
      
      // Try to save to file system first
      try {
        const response = await fetch(`/api/database/${this.dbFileName}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.data)
        });

        if (response.ok) {
          console.log('Database saved successfully to file system');
          // Clear localStorage since file system is working
          localStorage.removeItem('emm_database_v3');
          return;
        }
      } catch (fileError) {
        console.error('File system save failed:', fileError);
      }

      // Only fallback to localStorage if file system fails
      console.log('Falling back to localStorage...');
      localStorage.setItem('emm_database_v3', JSON.stringify(this.data));
      console.log('Database saved to localStorage as fallback');
      
    } catch (error) {
      console.error('Error saving database:', error);
    }
  }

  // Media Items
  getMediaItems(): MediaItem[] {
    console.log('Getting media items from database:', this.data.media_items);
    return [...(this.data.media_items || [])];
  }

  async addMediaItem(item: Omit<MediaItem, 'id' | 'uploaded_at'>): Promise<MediaItem> {
    const newItem: MediaItem = {
      ...item,
      id: `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      uploaded_at: new Date().toISOString()
    };
    
    console.log('Adding new media item to database:', newItem);
    
    if (!this.data.media_items) {
      this.data.media_items = [];
    }
    
    this.data.media_items.push(newItem);
    await this.saveDatabaseFile();
    
    console.log('Media item added to database. Total items:', this.data.media_items.length);
    return newItem;
  }

  async deleteMediaItem(id: string): Promise<boolean> {
    if (!this.data.media_items) return false;
    
    const initialLength = this.data.media_items.length;
    this.data.media_items = this.data.media_items.filter(item => item.id !== id);
    
    if (this.data.media_items.length < initialLength) {
      await this.saveDatabaseFile();
      console.log(`Media item ${id} deleted from database. Remaining items:`, this.data.media_items.length);
      return true;
    }
    return false;
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
    
    console.log('Adding new member to database:', newMember);
    
    if (!this.data.members) {
      this.data.members = [];
    }
    
    this.data.members.push(newMember);
    await this.saveDatabaseFile();
    
    console.log('Member added to database. Total members:', this.data.members.length);
    return newMember;
  }

  authenticateUser(username: string, password: string): Member | null {
    const user = this.data.members?.find(m => 
      m.username === username && m.password_hash === password
    );
    console.log('Database authentication for:', username, user ? 'SUCCESS' : 'FAILED');
    return user || null;
  }

  // Database management
  async clearDatabase() {
    console.log('Clearing database...');
    this.data = { ...defaultDatabase };
    await this.saveDatabaseFile();
  }

  getDatabaseStats() {
    return {
      mediaItems: this.data.media_items?.length || 0,
      members: this.data.members?.length || 0,
      version: this.data.version,
      lastUpdated: this.data.last_updated,
      fileName: this.dbFileName
    };
  }

  // Force reload from file
  async reloadFromFile() {
    await this.initializeDatabase();
  }
}

export const fileDb = new FileDatabaseService();
export type { MediaItem, Member };
