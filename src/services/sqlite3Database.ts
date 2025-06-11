
const API_URL = '/api/sqlite3/emm.db';

// Default data structure for initialization
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
      instagram_handle: '@admin',
      role: 'admin',
      created_at: new Date().toISOString()
    }
  ]
};

interface DatabaseStats {
  photoItems: number;
  videoItems: number;
  members: number;
  version: number;
}

export interface MediaItem {
  id: string;
  type: 'photo' | 'video';
  cover_url: string;
  media_urls: string[];
  description: string;
  credits: string[];
  uploaded_at: string;
}

export interface Member {
  id: string;
  username: string;
  password_hash: string;
  default_credit_name: string;
  instagram_handle: string;
  role: 'admin' | 'member';
  created_at: string;
}

let cachedData: any = null;

export const sqlite3Db = {
  async initializeDatabase() {
    try {
      console.log('🗄️ Initializing SQLite3 database...');
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_database',
          data: defaultData
        })
      });

      if (!response.ok) {
        console.log('Database might already exist, continuing...');
      }
      
      console.log('✅ SQLite3 database initialized');
      return true;
    } catch (error) {
      console.error('❌ Error initializing database:', error);
      return false;
    }
  },

  async reloadFromDatabase() {
    try {
      console.log('🔄 Reloading data from SQLite3...');
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        console.log('Database not found, initializing...');
        await this.initializeDatabase();
        const retryResponse = await fetch(API_URL);
        if (!retryResponse.ok) throw new Error('Failed to initialize database');
        cachedData = await retryResponse.json();
      } else {
        cachedData = await response.json();
      }
      
      console.log('✅ Data reloaded from SQLite3:', cachedData);
      return cachedData;
    } catch (error) {
      console.error('❌ Error reloading database:', error);
      // Fallback to default data
      cachedData = defaultData;
      return cachedData;
    }
  },

  getDatabaseStats(): DatabaseStats {
    if (!cachedData) return { photoItems: 0, videoItems: 0, members: 0, version: 1 };
    
    const mediaItems = cachedData.media_items || [];
    return {
      photoItems: mediaItems.filter((item: MediaItem) => item.type === 'photo').length,
      videoItems: mediaItems.filter((item: MediaItem) => item.type === 'video').length,
      members: (cachedData.members || []).length,
      version: cachedData.version || 1
    };
  },

  async getMediaItems(): Promise<MediaItem[]> {
    try {
      const data = await this.reloadFromDatabase();
      return data.media_items || [];
    } catch (error) {
      console.error('Error getting media items:', error);
      return [];
    }
  },

  async getPhotoItems(): Promise<MediaItem[]> {
    try {
      const mediaItems = await this.getMediaItems();
      return mediaItems.filter(item => item.type === 'photo');
    } catch (error) {
      console.error('Error getting photo items:', error);
      return [];
    }
  },

  async getVideoItems(): Promise<MediaItem[]> {
    try {
      const mediaItems = await this.getMediaItems();
      return mediaItems.filter(item => item.type === 'video');
    } catch (error) {
      console.error('Error getting video items:', error);
      return [];
    }
  },

  async getMembers(): Promise<Member[]> {
    try {
      const data = await this.reloadFromDatabase();
      return data.members || [];
    } catch (error) {
      console.error('Error getting members:', error);
      return [];
    }
  },

  async authenticateUser(username: string, password: string): Promise<Member | null> {
    try {
      const members = await this.getMembers();
      return members.find(member => 
        member.username === username && 
        member.password_hash === password
      ) || null;
    } catch (error) {
      console.error('Error authenticating user:', error);
      return null;
    }
  },

  async addMediaItem(item: Omit<MediaItem, 'id' | 'uploaded_at'>): Promise<MediaItem> {
    try {
      const newItem: MediaItem = {
        ...item,
        id: `media-${Date.now()}`,
        uploaded_at: new Date().toISOString()
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_media',
          item: newItem
        })
      });

      if (!response.ok) throw new Error('Failed to add media');
      
      // Update cached data
      if (cachedData) {
        cachedData.media_items = [...(cachedData.media_items || []), newItem];
      }
      
      return newItem;
    } catch (error) {
      console.error('Error adding media:', error);
      throw error;
    }
  },

  async deleteMediaItem(id: string): Promise<boolean> {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_media',
          id
        })
      });

      if (!response.ok) throw new Error('Failed to delete media');
      
      // Update cached data
      if (cachedData) {
        cachedData.media_items = cachedData.media_items.filter((item: MediaItem) => item.id !== id);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting media:', error);
      return false;
    }
  },

  async addMember(member: Omit<Member, 'id' | 'created_at'>): Promise<Member> {
    try {
      const newMember: Member = {
        ...member,
        id: `user-${Date.now()}`,
        created_at: new Date().toISOString()
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_member',
          member: newMember
        })
      });

      if (!response.ok) throw new Error('Failed to add member');
      
      // Update cached data
      if (cachedData) {
        cachedData.members = [...(cachedData.members || []), newMember];
      }
      
      return newMember;
    } catch (error) {
      console.error('Error adding member:', error);
      throw error;
    }
  }
};
