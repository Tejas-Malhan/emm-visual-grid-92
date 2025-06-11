
// Enhanced file-based database service with better error handling
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

// Fresh default data with working URLs
const createDefaultDatabase = (): Database => ({
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
});

class EnhancedFileDatabaseService {
  private data: Database;
  private readonly DB_ENDPOINT = '/api/database/emm_database.db';
  private isInitialized = false;

  constructor() {
    this.data = createDefaultDatabase();
    this.initialize();
  }

  private async initialize() {
    if (this.isInitialized) return;
    
    console.log('🔄 Initializing ENHANCED file database system...');
    
    // Clear any old localStorage data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('emm_database_v3');
      localStorage.removeItem('emm_database');
    }
    
    try {
      // Try to load from file database with better error handling
      const response = await fetch(this.DB_ENDPOINT, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const fileData = await response.json();
        console.log('✅ Loaded database from file API:', fileData);
        this.data = fileData;
      } else {
        console.log('⚠️ API not available (status:', response.status, '), using default data');
        await this.saveToFile(); // Try to create the database
      }
    } catch (error) {
      console.error('❌ Error loading from file database API:', error);
      console.log('📝 Using default data - database will be in memory only');
    }
    
    this.isInitialized = true;
  }

  private async saveToFile(): Promise<boolean> {
    try {
      this.data.last_updated = new Date().toISOString();
      this.data.version++;
      
      console.log('💾 Saving to file database API:', this.data);
      
      const response = await fetch(this.DB_ENDPOINT, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.data)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Database saved successfully to file API:', result);
        return true;
      } else {
        console.error('❌ Failed to save to file database API (status:', response.status, ')');
        return false;
      }
    } catch (error) {
      console.error('❌ Error saving to file database API:', error);
      return false;
    }
  }

  // Media Items
  getMediaItems(): MediaItem[] {
    console.log('📖 Getting media items from ENHANCED database:', this.data.media_items);
    return [...(this.data.media_items || [])];
  }

  async addMediaItem(item: Omit<MediaItem, 'id' | 'uploaded_at'>): Promise<MediaItem> {
    const newItem: MediaItem = {
      ...item,
      id: `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      uploaded_at: new Date().toISOString()
    };
    
    console.log('➕ Adding new media item to ENHANCED database:', newItem);
    
    this.data.media_items = this.data.media_items || [];
    this.data.media_items.push(newItem);
    
    const saved = await this.saveToFile();
    if (saved) {
      console.log('✅ Media item added successfully. Total items:', this.data.media_items.length);
      return newItem;
    } else {
      console.log('⚠️ Failed to save to file but keeping in memory');
      return newItem;
    }
  }

  async deleteMediaItem(id: string): Promise<boolean> {
    if (!this.data.media_items) return false;
    
    const initialLength = this.data.media_items.length;
    this.data.media_items = this.data.media_items.filter(item => item.id !== id);
    
    if (this.data.media_items.length < initialLength) {
      const saved = await this.saveToFile();
      console.log(`✅ Media item ${id} deleted. Remaining items:`, this.data.media_items.length);
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
    
    console.log('➕ Adding new member to ENHANCED database:', newMember);
    
    this.data.members = this.data.members || [];
    this.data.members.push(newMember);
    
    const saved = await this.saveToFile();
    if (saved) {
      console.log('✅ Member added successfully. Total members:', this.data.members.length);
      return newMember;
    } else {
      console.log('⚠️ Failed to save to file but keeping in memory');
      return newMember;
    }
  }

  authenticateUser(username: string, password: string): Member | null {
    const user = this.data.members?.find(m => 
      m.username === username && m.password_hash === password
    );
    console.log('🔐 ENHANCED Database authentication for:', username, user ? 'SUCCESS' : 'FAILED');
    return user || null;
  }

  // Force reload from file
  async reloadFromFile() {
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

export const newFileDb = new EnhancedFileDatabaseService();
export type { MediaItem, Member };
