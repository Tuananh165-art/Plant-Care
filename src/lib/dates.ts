import { Plant } from '@/src/types';

const dateOnly = (value: Date) => new Date(value.getFullYear(), value.getMonth(), value.getDate());

export function nextDueDate(plant: Pick<Plant, 'lastWatered' | 'wateringDays'>): Date {
  const date = new Date(`${plant.lastWatered}T00:00:00`);
  date.setDate(date.getDate() + plant.wateringDays);
  return dateOnly(date);
}

export function isOverdue(plant: Pick<Plant, 'lastWatered' | 'wateringDays'>, today = new Date()): boolean {
  return nextDueDate(plant).getTime() < dateOnly(today).getTime();
}

export function formatDate(value: Date | string): string {
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(new Date(value));
}

export const todayIso = () => new Date().toISOString().slice(0, 10);
