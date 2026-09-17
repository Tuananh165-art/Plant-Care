import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { PendingEdit, Plant } from '@/src/types';
import { plantApi, setMockOffline } from '@/src/lib/mockApi';

const SESSION_KEY = 'plant-care-session';
const PLANTS_KEY = 'plant-care-cached-plants';
const QUEUE_KEY = 'plant-care-pending-edits';

type AppState = {
  session: string | null;
  restoringSession: boolean;
  offline: boolean;
  pendingEdits: PendingEdit[];
  cachedPlants: Plant[];
  restore: () => Promise<void>;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  setOffline: (offline: boolean) => void;
  cachePlants: (plants: Plant[]) => Promise<void>;
  addPendingEdit: (edit: PendingEdit) => Promise<void>;
  syncPendingEdits: () => Promise<void>;
};

export const useAppStore = create<AppState>((set, get) => ({
  session: null, restoringSession: true, offline: false, pendingEdits: [], cachedPlants: [],
  restore: async () => {
    const [session, savedPlants, savedQueue] = await Promise.all([
      SecureStore.getItemAsync(SESSION_KEY), AsyncStorage.getItem(PLANTS_KEY), AsyncStorage.getItem(QUEUE_KEY)
    ]);
    set({ session, cachedPlants: savedPlants ? JSON.parse(savedPlants) as Plant[] : [], pendingEdits: savedQueue ? JSON.parse(savedQueue) as PendingEdit[] : [], restoringSession: false });
  },
  signIn: async (email) => { await SecureStore.setItemAsync(SESSION_KEY, email.trim()); set({ session: email.trim() }); },
  signOut: async () => { await SecureStore.deleteItemAsync(SESSION_KEY); set({ session: null }); },
  setOffline: (offline) => { setMockOffline(offline); set({ offline }); },
  cachePlants: async (cachedPlants) => { await AsyncStorage.setItem(PLANTS_KEY, JSON.stringify(cachedPlants)); set({ cachedPlants }); },
  addPendingEdit: async (edit) => { const pendingEdits = [...get().pendingEdits, edit]; await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(pendingEdits)); set({ pendingEdits }); },
  syncPendingEdits: async () => {
    if (get().offline) throw new Error('Hãy bật mạng trước khi đồng bộ.');
    for (const edit of get().pendingEdits) {
      if (edit.action === 'create') await plantApi.create(edit.plant);
      else if (edit.action === 'water') await plantApi.water(edit.plant);
      else await plantApi.update(edit.plant);
    }
    await AsyncStorage.removeItem(QUEUE_KEY);
    const cachedPlants = await plantApi.list();
    await get().cachePlants(cachedPlants);
    set({ pendingEdits: [] });
  }
}));

export const selectOffline = (state: AppState) => state.offline;
export const selectPendingCount = (state: AppState) => state.pendingEdits.length;
