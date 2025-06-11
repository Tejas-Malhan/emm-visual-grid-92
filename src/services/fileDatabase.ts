
// Enhanced file-based database service with localStorage fallback
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
  private readonly STORAGE_KEY = 'emm_database_persistent';
  private isInitialized = false;

  constructor() {
    this.data = createDefaultDatabase();
    this.initialize();
  }

  private async initialize() {
    if (this.isInitialized) return;
    
    console.log('🔄 Initializing FIXED file database system...');
    
    try {
      // First try localStorage for persistent storage
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsedData = JSON.parse(stored);
        this.data = parsedData;
        console.log('✅ Loaded database from localStorage:', this.data);
      } else {
        console.log('📝 No stored data found, using default database');
        await this.saveToStorage(); // Save default data
      }
    } catch (error) {
      console.error('❌ Error loading from localStorage:', error);
      console.log('📝 Using default data');
    }
    
    this.isInitialized = true;
  }

  private async saveToStorage(): Promise<boolean> {
    try {
      this.data.last_updated = new Date().toISOString();
      this.data.version++;
      
      console.log('💾 Saving to localStorage:', this.data);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
      console.log('✅ Database saved successfully to localStorage');
      return true;
    } catch (error) {
      console.error('❌ Error saving to localStorage:', error);
      return false;
    }
  }

  // Media Items
  getMediaItems(): MediaItem[] {
    console.log('📖 Getting media items from FIXED database:', this.data.media_items);
    return [...(this.data.media_items || [])];
  }

  async addMediaItem(item: Omit<MediaItem, 'id' | 'uploaded_at'>): Promise<MediaItem> {
    const newItem: MediaItem = {
      ...item,
      id: `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      uploaded_at: new Date().toISOString()
    };
    
    console.log('➕ Adding new media item to FIXED database:', newItem);
    
    this.data.media_items = this.data.media_items || [];
    this.data.media_items.push(newItem);
    
    const saved = await this.saveToStorage();
    if (saved) {
      console.log('✅ Media item added successfully. Total items:', this.data.media_items.length);
      return newItem;
    } else {
      console.log('⚠️ Failed to save to storage but keeping in memory');
      return newItem;
    }
  }

  async deleteMediaItem(id: string): Promise<boolean> {
    if (!this.data.media_items) return false;
    
    const initialLength = this.data.media_items.length;
    this.data.media_items = this.data.media_items.filter(item => item.id !== id);
    
    if (this.data.media_items.length < initialLength) {
      const saved = await this.saveToStorage();
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
    
    console.log('➕ Adding new member to FIXED database:', newMember);
    
    this.data.members = this.data.members || [];
    this.data.members.push(newMember);
    
    const saved = await this.saveToStorage();
    if (saved) {
      console.log('✅ Member added successfully. Total members:', this.data.members.length);
      return newMember;
    } else {
      console.log('⚠️ Failed to save to storage but keeping in memory');
      return newMember;
    }
  }

  authenticateUser(username: string, password: string): Member | null {
    const user = this.data.members?.find(m => 
      m.username === username && m.password_hash === password
    );
    console.log('🔐 FIXED Database authentication for:', username, user ? 'SUCCESS' : 'FAILED');
    return user || null;
  }

  // Force reload from storage
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

  // Clear all data (for testing)
  async clearDatabase() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.data = createDefaultDatabase();
    await this.saveToStorage();
    console.log('🗑️ Database cleared and reset to defaults');
  }
}

export const newFileDb = new EnhancedFileDatabaseService();
export type { MediaItem, Member };
