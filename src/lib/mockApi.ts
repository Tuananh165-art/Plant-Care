import { CareLog, Plant, PlantDraft } from '@/src/types';
import { todayIso } from './dates';

let unavailable = false;
let plants: Plant[] = [
  { id: 'monstera', name: 'Monstera', species: 'Monstera deliciosa', wateringDays: 7, lastWatered: '2026-09-07' },
  { id: 'snake', name: 'Lưỡi hổ', species: 'Dracaena trifasciata', wateringDays: 14, lastWatered: '2026-09-14' },
  { id: 'pothos', name: 'Trầu bà', species: 'Epipremnum aureum', wateringDays: 5, lastWatered: '2026-09-15' }
];
let logs: CareLog[] = [];

const delay = () => new Promise((resolve) => setTimeout(resolve, 350));
const guard = async () => { await delay(); if (unavailable) throw new Error('Không thể kết nối máy chủ.'); };
export const setMockOffline = (value: boolean) => { unavailable = value; };
export const plantApi = {
  async list(): Promise<Plant[]> { await guard(); return plants.map((plant) => ({ ...plant })); },
  async get(id: string): Promise<Plant> { await guard(); const plant = plants.find((item) => item.id === id); if (!plant) throw new Error('Không tìm thấy cây.'); return { ...plant }; },
  async create(draft: PlantDraft): Promise<Plant> { await guard(); const plant = { ...draft, id: `plant-${Date.now()}` }; plants = [plant, ...plants]; logs.push({ id: `log-${Date.now()}`, plantId: plant.id, date: todayIso(), action: 'created' }); return plant; },
  async update(plant: Plant): Promise<Plant> { await guard(); plants = plants.map((item) => item.id === plant.id ? plant : item); logs.push({ id: `log-${Date.now()}`, plantId: plant.id, date: todayIso(), action: 'updated' }); return plant; },
  async water(plant: Plant): Promise<Plant> { return this.update({ ...plant, lastWatered: todayIso() }); },
  async logsFor(plantId: string): Promise<CareLog[]> { await guard(); return logs.filter((log) => log.plantId === plantId); }
};
