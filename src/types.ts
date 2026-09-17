export type Plant = {
  id: string;
  name: string;
  species: string;
  wateringDays: number;
  lastWatered: string;
};

export type CareLog = {
  id: string;
  plantId: string;
  date: string;
  action: 'watered' | 'created' | 'updated';
};

export type PlantDraft = Omit<Plant, 'id'>;

export type PendingEdit = {
  id: string;
  action: 'create' | 'update' | 'water';
  plant: Plant;
};
