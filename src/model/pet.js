import { makeId } from './ids.js';
import { WeightEntry, MealEntry } from './entries.js';

export class Pet {
  constructor({ name, species = 'dog', sex = 'unknown', ageYears = 0, photoUrl = null, startWeightLb = 0 }) {
    this.id = makeId();
    this.name = name;
    this.species = species;          // 'dog' | 'cat' | ...
    this.sex = sex;                  // 'male' | 'female' | 'unknown'
    this.ageYears = Number(ageYears);
    this.photoUrl = photoUrl;

    this.goalWeightLb = null;
    this.dailyCalorieGoal = null;

    this.weightLog = [];             // WeightEntry[]
    if (startWeightLb) {
      // Set start weight to a date far in the past to ensure it's not the latest
      const startDate = new Date('2020-01-01'); // Far in the past
      this.weightLog.push(new WeightEntry(startWeightLb, startDate));
    }
    this.meals = [];                 // MealEntry[]
  }

  // --- goals ---
  setGoalWeight(lb) { this.goalWeightLb = Number(lb); }
  setDailyCalorieGoal(kcal) { this.dailyCalorieGoal = Number(kcal); }

  // --- weight log ---
  addWeight(pounds, { date, note, imageUrl } = {}) {
    const entry = new WeightEntry(pounds, date, note, imageUrl);
    this.weightLog.push(entry);
    this.weightLog.sort((a, b) => a.date - b.date);
    return entry;
  }
  latestWeight() {
    return this.weightLog.length ? this.weightLog[this.weightLog.length - 1].pounds : null;
  }
  goalStatus(toleranceLb = 0.5) {
    if (this.goalWeightLb == null) return 'NO_GOAL';
    const w = this.latestWeight(); if (w == null) return 'NO_WEIGHT';
    if (Math.abs(w - this.goalWeightLb) <= toleranceLb) return 'MET';
    return w > this.goalWeightLb ? 'ABOVE' : 'BELOW';
  }

  // --- meals / calories ---
  addMeal(name, calories, { date } = {}) {
    const m = new MealEntry(name, calories, date);
    this.meals.push(m);
    return m;
  }
  caloriesOn(dateLike = new Date()) {
    const d = new Date(dateLike);
    const sameDay = (a, b) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();
    return this.meals
      .filter(m => sameDay(m.date, d))
      .reduce((sum, m) => sum + m.calories, 0);
  }
  caloriesStatusOn(dateLike = new Date()) {
    const intake = this.caloriesOn(dateLike);
    if (this.dailyCalorieGoal == null) return { status: 'NO_GOAL', intake };
    if (intake < this.dailyCalorieGoal) return { status: 'UNDER', intake };
    if (intake === this.dailyCalorieGoal) return { status: 'MET', intake };
    return { status: 'OVER', intake };
  }

  // --- (de)serialize ---
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      species: this.species,
      sex: this.sex,
      ageYears: this.ageYears,
      photoUrl: this.photoUrl,
      goalWeightLb: this.goalWeightLb,
      dailyCalorieGoal: this.dailyCalorieGoal,
      weightLog: this.weightLog.map(w => w.toJSON()),
      meals: this.meals.map(m => m.toJSON())
    };
  }
  static fromJSON(o) {
    const p = new Pet({
      name: o.name,
      species: o.species,
      sex: o.sex,
      ageYears: o.ageYears,
      photoUrl: o.photoUrl,
      startWeightLb: 0
    });
    p.id = o.id;
    p.goalWeightLb = o.goalWeightLb ?? null;
    p.dailyCalorieGoal = o.dailyCalorieGoal ?? null;
    p.weightLog = (o.weightLog || []).map(WeightEntry.fromJSON);
    p.meals = (o.meals || []).map(MealEntry.fromJSON);
    return p;
  }
}
