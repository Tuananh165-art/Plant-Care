import test from 'node:test';
import assert from 'node:assert/strict';
import { isOverdue, nextDueDate } from '../src/lib/dates';

test('tính hạn tưới và quá hạn từ lastWatered cùng wateringDays', () => {
  const plant = { lastWatered: '2026-09-01', wateringDays: 7 };
  const due = nextDueDate(plant);
  assert.deepEqual([due.getFullYear(), due.getMonth() + 1, due.getDate()], [2026, 9, 8]);
  assert.equal(isOverdue(plant, new Date('2026-09-09T10:00:00')), true);
  assert.equal(isOverdue(plant, new Date('2026-09-08T10:00:00')), false);
});
