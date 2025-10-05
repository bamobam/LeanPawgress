// test/pet.test.js
import { describe, it, expect } from 'vitest';
import { mockIds } from './helpers/idMock.js';
import { Pet } from '../model/pet.js';

describe('Pet', () => {
  it('creates with start weight and computes goal status', () => {
    mockIds(['pet1','w1']);
    const p = new Pet({ name: 'Mochi', species: 'dog', startWeightLb: 32 });
    expect(p.id).toBe('pet1');
    expect(p.latestWeight()).toBe(32);

    p.setGoalWeight(28);
    expect(p.goalStatus()).toBe('ABOVE');

    // add new weight near goal (within 0.5 lb tolerance)
    p.addWeight(28.4, { date: '2026-10-04T12:00:00Z', note: 'check' });
    expect(p.goalStatus()).toBe('MET');
  });

  it('logs meals and reports daily calorie status', () => {
    mockIds(['pet1','m1','m2','m3']);
    const p = new Pet({ name: 'Mochi' });
    p.setDailyCalorieGoal(600);

    const day = new Date('2025-10-04T00:00:00Z');
    p.addMeal('breakfast', 250, { date: day });
    expect(p.caloriesStatusOn(day)).toEqual({ status: 'UNDER', intake: 250 });

    p.addMeal('dinner', 350, { date: day });
    expect(p.caloriesStatusOn(day)).toEqual({ status: 'MET', intake: 600 });

    p.addMeal('treat', 50, { date: day });
    expect(p.caloriesStatusOn(day)).toEqual({ status: 'OVER', intake: 650 });
  });

  it('sorts weights by date', () => {
    mockIds(['pet1','wA','wB','wC']);
    const p = new Pet({ name: 'Mochi' });
    p.addWeight(33, { date: '2025-09-30' });
    p.addWeight(31.6, { date: '2025-10-03' });
    p.addWeight(32.2, { date: '2025-10-01' });
    expect(p.weightLog.map(w => w.pounds)).toEqual([33, 32.2, 31.6]);
    expect(p.latestWeight()).toBe(31.6);
  });
});
