import { AnalysisState } from '../types';

const DB_NAME = 'CircuitHarvesterDB';
const STORE_NAME = 'sessions';
const DB_VERSION = 1;
const EXPIRATION_MS = 60 * 60 * 1000; // 1 Hour

interface StoredSession {
  id: string;
  timestamp: number;
  state: AnalysisState;
}

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

export const saveSession = async (state: AnalysisState): Promise<void> => {
  // Don't save if empty or loading
  if (!state.result && !state.image) return;

  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    const session: StoredSession = {
      id: 'latest',
      timestamp: Date.now(),
      state
    };

    store.put(session);
    
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.error('Failed to save session:', error);
  }
};

export const loadSession = async (): Promise<AnalysisState | null> => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get('latest');

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const session: StoredSession = request.result;
        if (!session) {
          resolve(null);
          return;
        }

        const age = Date.now() - session.timestamp;
        if (age > EXPIRATION_MS) {
          // Session expired
          resolve(null);
          // Optional: clean up expired session
          clearSession();
        } else {
          resolve(session.state);
        }
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to load session:', error);
    return null;
  }
};

export const clearSession = async (): Promise<void> => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete('latest');
  } catch (error) {
    console.error('Failed to clear session:', error);
  }
};
