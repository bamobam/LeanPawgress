// test/owner_store.test.js
import { describe, it, beforeEach, expect } from 'vitest';
import { mockIds } from './helpers/idMock.js';
import { Owner } from '../model/Owner.js';
import { Pet } from '../model/Pet.js';
import { loadOwners, saveOwners } from '../model/store.js';

describe('Owner + store', () => {
  beforeEach(() => localStorage.clear());

  it('adds pets and round-trips through localStorage', () => {
    mockIds(['own1','pet1','w1','m1']);
    const grace = new Owner({ name: 'Grace', email: 'g@example.com' });
    const mochi = new Pet({ name: 'Mochi', species: 'dog', startWeightLb: 32, sex: 'male' });
    grace.addPet(mochi);
    mochi.setGoalWeight(28);
    mochi.addWeight(31.6, { date: '2025-10-04' });
    mochi.addMeal('kibble', 250, { date: '2025-10-04' });

    saveOwners([grace]);

    const loaded = loadOwners();
    expect(loaded).toHaveLength(1);
    const g2 = loaded[0];
    expect(g2.name).toBe('Grace');
    const m2 = g2.getPet(mochi.id);
    expect(m2.latestWeight()).toBe(31.6);
    expect(m2.caloriesOn('2025-10-04')).toBe(250);
  });
});
