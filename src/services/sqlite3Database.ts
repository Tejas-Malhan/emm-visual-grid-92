const API_URL = '/api/sqlite3/emm.db';

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

export const sqlite3Db = {
  async reloadFromDatabase() {
    try {
      const response = await fetch(API_URL);
      return await response.json();
    } catch (error) {
      console.error('Error reloading database:', error);
      throw error;
    }
  },

  getDatabaseStats(): DatabaseStats {
    return {
      photoItems: 0,
      videoItems: 0,
      members: 0,
      version: 1
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

  async getMembers(): Promise<Member[]> {
    try {
      const data = await this.reloadFromDatabase();
      return data.members || [];
    } catch (error) {
      console.error('Error getting members:', error);
      return [];
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
      return newMember;
    } catch (error) {
      console.error('Error adding member:', error);
      throw error;
    }
  }
};
