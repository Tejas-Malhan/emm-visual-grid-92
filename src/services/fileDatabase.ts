
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

// Default data that gets saved to the database file
const defaultDatabase: Database = {
  version: 1,
  last_updated: new Date().toISOString(),
  media_items: [
    {
      id: 'default-1',
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
  private dbUrl = `/api/database/${this.dbFileName}`;

  constructor() {
    this.data = { ...defaultDatabase };
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    try {
      console.log('Initializing file-based database system...');
      
      // Try to load existing database file
      const response = await fetch(this.dbUrl);
      
      if (response.ok) {
        const existingData = await response.json();
        console.log('Loaded existing database file:', existingData);
        this.data = existingData;
      } else {
        console.log('No existing database file found, creating new one...');
        await this.saveDatabaseFile();
      }
    } catch (error) {
      console.error('Error initializing database:', error);
      console.log('Using default data and will try to save...');
      await this.saveDatabaseFile();
    }
  }

  private async saveDatabaseFile() {
    try {
      this.data.last_updated = new Date().toISOString();
      this.data.version = (this.data.version || 0) + 1;
      
      console.log('Saving database to file:', this.data);
      
      // Save to server file system
      const response = await fetch(this.dbUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.data)
      });

      if (!response.ok) {
        throw new Error(`Failed to save database: ${response.statusText}`);
      }

      console.log('Database saved successfully to file system');
      
      // Also backup in localStorage as fallback
      localStorage.setItem('emm_db_backup', JSON.stringify(this.data));
      
    } catch (error) {
      console.error('Error saving database file:', error);
      // Fallback to localStorage if file system fails
      localStorage.setItem('emm_database_v3', JSON.stringify(this.data));
      console.log('Saved to localStorage as fallback');
    }
  }

  // Media Items
  getMediaItems(): MediaItem[] {
    console.log('Getting media items from file database:', this.data.media_items);
    return [...(this.data.media_items || [])];
  }

  async addMediaItem(item: Omit<MediaItem, 'id' | 'uploaded_at'>): Promise<MediaItem> {
    const newItem: MediaItem = {
      ...item,
      id: `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      uploaded_at: new Date().toISOString()
    };
    
    console.log('Adding new media item to file database:', newItem);
    
    if (!this.data.media_items) {
      this.data.media_items = [];
    }
    
    this.data.media_items.push(newItem);
    await this.saveDatabaseFile();
    
    console.log('Media item added to file database. Total items:', this.data.media_items.length);
    return newItem;
  }

  async deleteMediaItem(id: string): Promise<boolean> {
    if (!this.data.media_items) return false;
    
    const initialLength = this.data.media_items.length;
    this.data.media_items = this.data.media_items.filter(item => item.id !== id);
    
    if (this.data.media_items.length < initialLength) {
      await this.saveDatabaseFile();
      console.log(`Media item ${id} deleted from file database. Remaining items:`, this.data.media_items.length);
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
    
    console.log('Adding new member to file database:', newMember);
    
    if (!this.data.members) {
      this.data.members = [];
    }
    
    this.data.members.push(newMember);
    await this.saveDatabaseFile();
    
    console.log('Member added to file database. Total members:', this.data.members.length);
    return newMember;
  }

  authenticateUser(username: string, password: string): Member | null {
    const user = this.data.members?.find(m => 
      m.username === username && m.password_hash === password
    );
    console.log('File database authentication for:', username, user ? 'SUCCESS' : 'FAILED');
    return user || null;
  }

  // Database management
  async clearDatabase() {
    console.log('Clearing file database...');
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
