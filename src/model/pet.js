// ------- Minimal value types -------
export class WeightEntry {
    constructor(pounds, date = new Date(), note = "", imageUrl = null) {
      this.pounds = Number(pounds);
      this.date = new Date(date);
      this.note = note;
      this.imageUrl = imageUrl;
    }
  }
  
 export class MealEntry {
    constructor(name, calories, date = new Date()) {
      this.name = name;
      this.calories = Number(calories);
      this.date = new Date(date);
    }
  }
  
  // ------- MVP: Pet -------
 export class Pet {
    constructor({ name, ageYears = 0, sex = "unknown", startWeightLb = 0, photoUrl = null }) {
      this.name = name;
      this.ageYears = Number(ageYears);
      this.sex = sex;
      this.photoUrl = photoUrl;
  
      this.weightLog = [];
      if (startWeightLb) this.weightLog.push(new WeightEntry(startWeightLb));
  
      this.goalWeightLb = null;
      this.dailyCalorieGoal = null;
      this.meals = [];
    }
  
    // ---- profile goals ----
    setGoalWeight(lb) { this.goalWeightLb = Number(lb); }
    setDailyCalorieGoal(kcal) { this.dailyCalorieGoal = Number(kcal); }
  
    // ---- weights ----
    addWeight(pounds, { date, note, imageUrl } = {}) {
      const entry = new WeightEntry(pounds, date, note, imageUrl);
      this.weightLog.push(entry);
      this.weightLog.sort((a, b) => a.date - b.date);
      return entry;
    }
    latestWeight() {
      if (this.weightLog.length === 0) return null;
      return this.weightLog[this.weightLog.length - 1].pounds;
    }
    // Quick status vs goal
    goalStatus(toleranceLb = 0.5) {
      if (this.goalWeightLb == null) return "NO_GOAL";
      const w = this.latestWeight();
      if (w == null) return "NO_WEIGHT";
      if (Math.abs(w - this.goalWeightLb) <= toleranceLb) return "MET";
      return w > this.goalWeightLb ? "ABOVE" : "BELOW";
    }
  
    // ---- calories & meals ----
    addMeal(name, calories, { date } = {}) {
      const m = new MealEntry(name, calories, date);
      this.meals.push(m);
      return m;
    }
    caloriesToday(dateLike = new Date()) {
      const d = new Date(dateLike);
      const sameDay = (a, b) =>
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();
      return this.meals
        .filter(m => sameDay(m.date, d))
        .reduce((sum, m) => sum + m.calories, 0);
    }
    caloriesStatusToday(dateLike = new Date()) {
      if (this.dailyCalorieGoal == null) return { status: "NO_GOAL", intake: this.caloriesToday(dateLike) };
      const intake = this.caloriesToday(dateLike);
      if (intake < this.dailyCalorieGoal) return { status: "UNDER", intake };
      if (intake === this.dailyCalorieGoal) return { status: "MET", intake };
      return { status: "OVER", intake };
    }
  }
  
  // ------- Example (delete in production) -------
  /*
  const mochi = new Pet({ name: "Mochi", ageYears: 4, sex: "male", startWeightLb: 32 });
  mochi.setGoalWeight(28);
  mochi.setDailyCalorieGoal(600);
  
  mochi.addWeight(31.6, { note: "Day 1" });
  mochi.addMeal("kibble breakfast", 250);
  mochi.addMeal("kibble dinner", 320);
  
  console.log(mochi.goalStatus());            // ABOVE | MET | BELOW | NO_GOAL | NO_WEIGHT
  console.log(mochi.caloriesStatusToday());   // { status: UNDER/MET/OVER/NO_GOAL, intake: number }
  */
  