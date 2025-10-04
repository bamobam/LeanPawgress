import { makeId } from './ids.js';

export class WeightEntry {
  constructor(pounds, date = new Date(), note = "", imageUrl = null) {
    this.id = makeId();
    this.pounds = Number(pounds);
    this.date = new Date(date);
    this.note = note;
    this.imageUrl = imageUrl;
  }
  toJSON() {
    return {
      id: this.id,
      pounds: this.pounds,
      date: this.date.toISOString(),
      note: this.note,
      imageUrl: this.imageUrl
    };
  }
  static fromJSON(o) {
    const w = new WeightEntry(o.pounds, o.date, o.note, o.imageUrl);
    w.id = o.id;
    return w;
  }
}

export class MealEntry {
  constructor(name, calories, date = new Date()) {
    this.id = makeId();
    this.name = name;
    this.calories = Number(calories);
    this.date = new Date(date);
  }
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      calories: this.calories,
      date: this.date.toISOString()
    };
  }
  static fromJSON(o) {
    const m = new MealEntry(o.name, o.calories, o.date);
    m.id = o.id;
    return m;
  }
}
