
// Simple file-based database service for Netlify
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
}

// Initialize with default admin user and sample media
const defaultDatabase: Database = {
  media_items: [
    {
      id: '1',
      type: 'photo',
      cover_url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=600&fit=crop',
      media_urls: [
        'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop'
      ],
      description: 'Professional portrait session capturing authentic moments',
      credits: ['Emma Martinez', 'Michael Chen'],
      uploaded_at: new Date().toISOString()
    },
    {
      id: '2',
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

class DatabaseService {
  private data: Database;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const stored = localStorage.getItem('emm_database');
    if (stored) {
      try {
        this.data = JSON.parse(stored);
        // Ensure media_items exist in case of old data format
        if (!this.data.media_items) {
          this.data.media_items = defaultDatabase.media_items;
        }
        // Ensure members have instagram_handle field
        this.data.members = this.data.members.map(member => ({
          ...member,
          instagram_handle: member.instagram_handle || ''
        }));
      } catch (error) {
        console.error('Error parsing stored data, using defaults:', error);
        this.data = defaultDatabase;
      }
    } else {
      this.data = defaultDatabase;
    }
    this.saveToStorage();
  }

  private saveToStorage() {
    try {
      localStorage.setItem('emm_database', JSON.stringify(this.data));
      console.log('Database saved successfully:', this.data);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  // Media Items
  getMediaItems(): MediaItem[] {
    console.log('Getting media items:', this.data.media_items);
    return this.data.media_items || [];
  }

  addMediaItem(item: Omit<MediaItem, 'id' | 'uploaded_at'>): MediaItem {
    const newItem: MediaItem = {
      ...item,
      id: Date.now().toString(),
      uploaded_at: new Date().toISOString()
    };
    console.log('Adding new media item:', newItem);
    this.data.media_items.push(newItem);
    this.saveToStorage();
    return newItem;
  }

  deleteMediaItem(id: string): boolean {
    const index = this.data.media_items.findIndex(item => item.id === id);
    if (index > -1) {
      this.data.media_items.splice(index, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // Members
  getMembers(): Member[] {
    return this.data.members || [];
  }

  addMember(member: Omit<Member, 'id' | 'created_at'>): Member {
    const newMember: Member = {
      ...member,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    this.data.members.push(newMember);
    this.saveToStorage();
    return newMember;
  }

  authenticateUser(username: string, password: string): Member | null {
    const user = this.data.members.find(m => 
      m.username === username && m.password_hash === password
    );
    return user || null;
  }

  // Clear all data (for debugging)
  clearDatabase() {
    this.data = defaultDatabase;
    this.saveToStorage();
  }
}

export const db = new DatabaseService();
export type { MediaItem, Member };
