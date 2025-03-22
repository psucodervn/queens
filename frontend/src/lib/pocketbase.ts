import PocketBase from 'pocketbase';

// Initialize PocketBase with auto-cancellation disabled for auth calls
export const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090');

// Enable auto refresh of auth store
pb.autoCancellation(false);

// Types for auth store
export type AuthModel = {
  id: string;
  email: string;
  username: string;
  created: string;
  updated: string;
};
