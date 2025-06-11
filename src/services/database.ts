
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
      cover_url: 'https://d3.indown.io/fetch?url=https%3A%2F%2Finstagram.fphl1-1.fna.fbcdn.net%2Fv%2Ft51.2885-15%2F504389281_18052496195579942_4563529490455079697_n.webp%3Fstp%3Ddst-jpg_e35_p1080x1080_sh0.08_tt6%26_nc_ht%3Dinstagram.fphl1-1.fna.fbcdn.net%26_nc_cat%3D102%26_nc_oc%3DQ6cZ2QGzIhwQ9i5z7KOQkFQjYR6izLZAyaU10EnhjlV-E-DDi0xtZgannBQzaUEOFgN53SQpyn9F2WwG8vKP9ilUUTme%26_nc_ohc%3DqNzQSp9R-hkQ7kNvwG_8Z3Q%26_nc_gid%3DCXRJ8MQ3z9NsJeH851vSKQ%26edm%3DANTKIIoBAAAA%26ccb%3D7-5%26oh%3D00_AfMzfqsiPfYVFq5rrr8xECVt3h57k3wwvaJfP2lHbi1i-g%26oe%3D684ED65B%26_nc_sid%3Dd885a2&is_download=0&expires=1749623127&link=https%3A%2F%2Fwww.instagram.com%2Fp%2FDKsByefCFI8%2F%3Fimg_index%3D1&signature=251d2e2e7de32c7adfac61c8d62d429bfbdc5b3899f0006e10f2c56cff1d010a',
      media_urls: [
        'https://d3.indown.io/fetch?url=https%3A%2F%2Finstagram.fphl1-1.fna.fbcdn.net%2Fv%2Ft51.2885-15%2F504389281_18052496195579942_4563529490455079697_n.webp%3Fstp%3Ddst-jpg_e35_p1080x1080_sh0.08_tt6%26_nc_ht%3Dinstagram.fphl1-1.fna.fbcdn.net%26_nc_cat%3D102%26_nc_oc%3DQ6cZ2QGzIhwQ9i5z7KOQkFQjYR6izLZAyaU10EnhjlV-E-DDi0xtZgannBQzaUEOFgN53SQpyn9F2WwG8vKP9ilUUTme%26_nc_ohc%3DqNzQSp9R-hkQ7kNvwG_8Z3Q%26_nc_gid%3DCXRJ8MQ3z9NsJeH851vSKQ%26edm%3DANTKIIoBAAAA%26ccb%3D7-5%26oh%3D00_AfMzfqsiPfYVFq5rrr8xECVt3h57k3wwvaJfP2lHbi1i-g%26oe%3D684ED65B%26_nc_sid%3Dd885a2&is_download=0&expires=1749623127&link=https%3A%2F%2Fwww.instagram.com%2Fp%2FDKsByefCFI8%2F%3Fimg_index%3D1&signature=251d2e2e7de32c7adfac61c8d62d429bfbdc5b3899f0006e10f2c56cff1d010a',
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
  private storageKey = 'emm_database_v2'; // Changed key to force refresh

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      // Try to load from localStorage first
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.data = JSON.parse(stored);
        console.log('Loaded data from localStorage:', this.data);
      } else {
        console.log('No stored data found, using defaults');
        this.data = { ...defaultDatabase };
      }
      
      // Ensure all required fields exist
      if (!this.data.media_items) {
        this.data.media_items = [...defaultDatabase.media_items];
      }
      if (!this.data.members) {
        this.data.members = [...defaultDatabase.members];
      }
      
      // Ensure members have all required fields
      this.data.members = this.data.members.map(member => ({
        ...member,
        instagram_handle: member.instagram_handle || ''
      }));
      
      this.saveToStorage();
    } catch (error) {
      console.error('Error loading data, using defaults:', error);
      this.data = { ...defaultDatabase };
      this.saveToStorage();
    }
  }

  private saveToStorage() {
    try {
      const dataString = JSON.stringify(this.data);
      localStorage.setItem(this.storageKey, dataString);
      console.log('Database saved successfully. Current data:', this.data);
      
      // Also try to persist in other ways for better persistence
      if ('sessionStorage' in window) {
        sessionStorage.setItem(this.storageKey + '_backup', dataString);
      }
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  // Media Items
  getMediaItems(): MediaItem[] {
    console.log('Getting media items:', this.data.media_items);
    return [...(this.data.media_items || [])];
  }

  addMediaItem(item: Omit<MediaItem, 'id' | 'uploaded_at'>): MediaItem {
    const newItem: MediaItem = {
      ...item,
      id: `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      uploaded_at: new Date().toISOString()
    };
    
    console.log('Adding new media item:', newItem);
    
    if (!this.data.media_items) {
      this.data.media_items = [];
    }
    
    this.data.media_items.push(newItem);
    this.saveToStorage();
    
    console.log('Media item added. Total items:', this.data.media_items.length);
    return newItem;
  }

  deleteMediaItem(id: string): boolean {
    if (!this.data.media_items) return false;
    
    const initialLength = this.data.media_items.length;
    this.data.media_items = this.data.media_items.filter(item => item.id !== id);
    
    if (this.data.media_items.length < initialLength) {
      this.saveToStorage();
      console.log(`Media item ${id} deleted. Remaining items:`, this.data.media_items.length);
      return true;
    }
    return false;
  }

  // Members
  getMembers(): Member[] {
    return [...(this.data.members || [])];
  }

  addMember(member: Omit<Member, 'id' | 'created_at'>): Member {
    const newMember: Member = {
      ...member,
      id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString()
    };
    
    if (!this.data.members) {
      this.data.members = [];
    }
    
    this.data.members.push(newMember);
    this.saveToStorage();
    return newMember;
  }

  authenticateUser(username: string, password: string): Member | null {
    const user = this.data.members?.find(m => 
      m.username === username && m.password_hash === password
    );
    return user || null;
  }

  // Debug methods
  clearDatabase() {
    console.log('Clearing database...');
    this.data = { ...defaultDatabase };
    this.saveToStorage();
  }

  getDatabaseStats() {
    return {
      mediaItems: this.data.media_items?.length || 0,
      members: this.data.members?.length || 0,
      storageKey: this.storageKey
    };
  }
}

export const db = new DatabaseService();
export type { MediaItem, Member };
