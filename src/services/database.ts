
// Updated database service that uses the new file-based system
export { fileDb as db, type MediaItem, type Member } from './fileDatabase';

// Legacy exports for backward compatibility
export type { MediaItem, Member } from './fileDatabase';
