import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plant, PlantDraft } from '@/src/types';
import { plantApi } from '@/src/lib/mockApi';
import { useAppStore } from '@/src/store/appStore';

export const plantKey = ['plants'] as const;

export function usePlants() {
  const cachedPlants = useAppStore((state) => state.cachedPlants);
  const cachePlants = useAppStore((state) => state.cachePlants);
  return useQuery({ queryKey: plantKey, queryFn: plantApi.list, initialData: cachedPlants.length ? cachedPlants : undefined, staleTime: 10_000, select: (plants) => plants, meta: { cachePlants } });
}

export function usePlant(id: string) {
  const plants = useAppStore((state) => state.cachedPlants);
  return useQuery({ queryKey: [...plantKey, id], queryFn: () => plantApi.get(id), initialData: plants.find((plant) => plant.id === id) });
}

export function useSavePlant() {
  const client = useQueryClient(); const cachePlants = useAppStore((state) => state.cachePlants); const addPending = useAppStore((state) => state.addPendingEdit);
  const apply = async (plant: Plant, action: 'create' | 'update' | 'water') => {
    const previous = client.getQueryData<Plant[]>(plantKey) ?? [];
    const next = action === 'create' ? [plant, ...previous] : previous.map((item) => item.id === plant.id ? plant : item);
    client.setQueryData(plantKey, next); client.setQueryData([...plantKey, plant.id], plant); await cachePlants(next);
    try { const saved = action === 'create' ? await plantApi.create(plant) : action === 'water' ? await plantApi.water(plant) : await plantApi.update(plant); const fresh = action === 'create' ? next.map((item) => item.id === plant.id ? saved : item) : next; client.setQueryData(plantKey, fresh); await cachePlants(fresh); return saved; }
    catch { await addPending({ id: `pending-${Date.now()}`, action, plant }); return plant; }
  };
  return {
    create: useMutation({ mutationFn: (draft: PlantDraft) => apply({ ...draft, id: `local-${Date.now()}` }, 'create') }),
    update: useMutation({ mutationFn: (plant: Plant) => apply(plant, 'update') }),
    water: useMutation({ mutationFn: (plant: Plant) => apply({ ...plant, lastWatered: new Date().toISOString().slice(0, 10) }, 'water') })
  };
}
