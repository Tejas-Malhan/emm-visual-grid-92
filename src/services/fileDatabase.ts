const STORAGE_KEY = 'emm_file_db';

// Default data structure
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
      role: 'admin',
      created_at: new Date().toISOString()
    }
  ]
};

let dbData: any = null;

function getStoredData() {
  if (dbData === null) {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      dbData = stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(defaultData));
    } catch (error) {
      console.error('Error loading stored data:', error);
      dbData = JSON.parse(JSON.stringify(defaultData));
    }
  }
  return dbData;
}

function saveStoredData(data: any) {
  dbData = data;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

export const newFileDb = {
  reloadFromStorage() {
    return new Promise<void>((resolve) => {
      getStoredData();
      resolve();
    });
  },

  authenticateUser(username: string, password: string) {
    const data = getStoredData();
    return data.members.find(
      (member: any) => 
        member.username === username && 
        member.password_hash === password
    );
  },

  getMediaItems() {
    return getStoredData().media_items || [];
  },

  getMembers() {
    return getStoredData().members || [];
  },

  addMediaItem(item: any) {
    const data = getStoredData();
    const newItem = {
      ...item,
      id: `media-${Date.now()}`,
      uploaded_at: new Date().toISOString()
    };
    
    data.media_items = [...(data.media_items || []), newItem];
    data.last_updated = new Date().toISOString();
    data.version++;
    
    saveStoredData(data);
    return newItem;
  },

  deleteMediaItem(id: string) {
    const data = getStoredData();
    data.media_items = data.media_items.filter((item: any) => item.id !== id);
    data.last_updated = new Date().toISOString();
    data.version++;
    
    saveStoredData(data);
    return true;
  },

  addMember(member: any) {
    const data = getStoredData();
    const newMember = {
      ...member,
      id: `user-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    
    data.members = [...(data.members || []), newMember];
    data.last_updated = new Date().toISOString();
    data.version++;
    
    saveStoredData(data);
    return newMember;
  }
};
