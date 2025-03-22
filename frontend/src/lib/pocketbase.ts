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

// Load auth store from local storage
try {
  const authData = localStorage.getItem('pocketbase_auth');
  if (authData) {
    const parsedData = JSON.parse(authData);
    pb.authStore.save(parsedData.token, parsedData.model);
  }
} catch (error) {
  console.error('Error loading auth data:', error);
  pb.authStore.clear();
}

// Subscribe to auth store changes to persist in local storage
pb.authStore.onChange(() => {
  try {
    localStorage.setItem(
      'pocketbase_auth',
      JSON.stringify({
        token: pb.authStore.token,
        model: pb.authStore.model,
      })
    );
  } catch (error) {
    console.error('Error saving auth data:', error);
  }
}, true);
