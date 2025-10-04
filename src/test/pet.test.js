import { describe, it, expect } from 'vitest';
import { Pet } from '../model/Pet.js';

describe('Pet MVP', () => {
  it('creates a profile with optional start weight', () => {
    const p = new Pet({ name: 'Mochi', ageYears: 4, sex: 'male', startWeightLb: 32 });
    expect(p.name).toBe('Mochi');
    expect(p.latestWeight()).toBe(32);
  });

  it('adds weight entries and keeps them sorted by date', () => {
    const p = new Pet({ name: 'Mochi' });
    const d1 = new Date('2025-10-01');
    const d2 = new Date('2025-10-03');
    const d0 = new Date('2025-09-30');

    p.addWeight(31.6, { date: d2, note: 'later' });
    p.addWeight(32.2, { date: d1, note: 'mid' });
    p.addWeight(33.0, { date: d0, note: 'earliest' });

    expect(p.weightLog.map(w => w.pounds)).toEqual([33.0, 32.2, 31.6]);
    expect(p.latestWeight()).toBe(31.6);
  });

  it('computes goal status', () => {
    const p = new Pet({ name: 'Mochi', startWeightLb: 32 });
    p.setGoalWeight(28);
    expect(p.goalStatus()).toBe('ABOVE');
    p.addWeight(28.3);
    expect(p.goalStatus()).toBe('MET'); // within default 0.5 lb tolerance
  });

  it('logs meals and totals calories for a day', () => {
    const p = new Pet({ name: 'Mochi' });
    const day = new Date('2025-10-04');
    p.addMeal('kibble breakfast', 250, { date: day });
    p.addMeal('kibble dinner', 320, { date: day });
    p.addMeal('yesterday snack', 50, { date: new Date('2025-10-03') });

    expect(p.caloriesToday(day)).toBe(570);
  });

  it('reports calories status vs daily goal', () => {
    const p = new Pet({ name: 'Mochi' });
    const day = new Date('2025-10-04');
    p.setDailyCalorieGoal(600);

    p.addMeal('breakfast', 250, { date: day });
    expect(p.caloriesStatusToday(day)).toEqual({ status: 'UNDER', intake: 250 });

    p.addMeal('dinner', 350, { date: day });
    expect(p.caloriesStatusToday(day)).toEqual({ status: 'MET', intake: 600 });

    p.addMeal('treat', 50, { date: day });
    expect(p.caloriesStatusToday(day)).toEqual({ status: 'OVER', intake: 650 });
  });

  it('handles no goals gracefully', () => {
    const p = new Pet({ name: 'Mochi' });
    expect(p.goalStatus()).toBe('NO_GOAL');
    expect(p.caloriesStatusToday()).toEqual({ status: 'NO_GOAL', intake: 0 });
  });
});
