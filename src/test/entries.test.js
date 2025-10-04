// test/entries.test.js
import { describe, it, expect } from 'vitest';
import { mockIds } from './helpers/idMock.js';
import { WeightEntry, MealEntry } from '../model/entries.js';

describe('entries', () => {
  it('WeightEntry serializes/deserializes', () => {
    mockIds(['w1']);
    const w = new WeightEntry(32, '2025-10-04T00:00:00Z', 'start', null);
    const json = w.toJSON();
    expect(json).toMatchObject({ id: 'w1', pounds: 32, note: 'start' });

    const w2 = WeightEntry.fromJSON(json);
    expect(w2.id).toBe('w1');
    expect(w2.pounds).toBe(32);
    expect(w2.date.toISOString()).toBe('2025-10-04T00:00:00.000Z');
  });

  it('MealEntry serializes/deserializes', () => {
    mockIds(['m1']);
    const m = new MealEntry('kibble', 250, '2025-10-04T08:00:00Z');
    const json = m.toJSON();
    expect(json).toMatchObject({ id: 'm1', name: 'kibble', calories: 250 });

    const m2 = MealEntry.fromJSON(json);
    expect(m2.id).toBe('m1');
    expect(m2.calories).toBe(250);
  });
});
