// src/test/owner_store.test.js
import { describe, it, beforeEach, expect } from 'vitest';
import { Owner } from '../model/Owner.js';
import { Pet } from '../model/pet.js';
import { loadOwners, saveOwners } from '../persistence/store.js';

describe('Owner + store', () => {
  beforeEach(() => localStorage.clear());

  it('round-trips through localStorage', () => {
    const grace = new Owner({ name: 'Grace', email: 'g@example.com' });
    const mochi = new Pet({ name: 'Mochi', species: 'dog', startWeightLb: 32, sex: 'male' });
    grace.addPet(mochi);
    mochi.setGoalWeight(28);
    mochi.addMeal('kibble', 250, { date: '2025-10-04' });

    saveOwners([grace]);

    const loaded = loadOwners();
    const g2 = loaded[0];
    const m2 = g2.getPet(mochi.id);
    expect(m2.latestWeight()).toBe(32);
    expect(m2.caloriesOn('2025-10-04')).toBe(250);
  });
});
