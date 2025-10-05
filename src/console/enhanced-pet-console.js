#!/usr/bin/env node
import { Pet } from '../model/pet.js';
import { Owner } from '../model/Owner.js';
import { WeightEntry, MealEntry } from '../model/entries.js';
import readline from 'readline';

class EnhancedPetConsole {
  constructor() {
    this.owners = new Map(); // Store owners by name
    this.currentOwner = null;
    this.currentPet = null;
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: 'pet> '
    });

    this.setupEventHandlers();
    this.showWelcome();
  }

  setupEventHandlers() {
    this.rl.on('line', (input) => {
      this.handleCommand(input.trim());
      this.rl.prompt();
    });

    this.rl.on('close', () => {
      console.log('\nGoodbye! 👋');
      process.exit(0);
    });
  }

  showWelcome() {
    console.log('\n🐾 Welcome to the Enhanced Pet Management Console! 🐾');
    console.log('Type "help" to see available commands');
    console.log('Type "exit" to quit\n');
    this.rl.prompt();
  }

  handleCommand(input) {
    if (!input) return;

    const [command, ...args] = input.split(' ');
    const cmd = command.toLowerCase();

    try {
      switch (cmd) {
        case 'help':
          this.showHelp();
          break;
        case 'createowner':
          this.createOwner(args);
          break;
        case 'selectowner':
          this.selectOwner(args);
          break;
        case 'listowners':
          this.listOwners();
          break;
        case 'currentowner':
          this.showCurrentOwner();
          break;
        case 'createpet':
          this.createPet(args);
          break;
        case 'listpets':
          this.listPets();
          break;
        case 'selectpet':
          this.selectPet(args);
          break;
        case 'currentpet':
          this.showCurrentPet();
          break;
        case 'addweight':
          this.addWeight(args);
          break;
        case 'addmeal':
          this.addMeal(args);
          break;
        case 'setgoal':
          this.setGoal(args);
          break;
        case 'setcaloriegoal':
          this.setCalorieGoal(args);
          break;
        case 'status':
          this.showStatus();
          break;
        case 'calories':
          this.showCalories(args);
          break;
        case 'weights':
          this.showWeights();
          break;
        case 'meals':
          this.showMeals(args);
          break;
        case 'weightshistory':
          this.showWeightsHistory(args);
          break;
        case 'mealshistory':
          this.showMealsHistory(args);
          break;
        case 'report':
          this.generateReport(args);
          break;
        case 'save':
          this.saveData(args);
          break;
        case 'load':
          this.loadData(args);
          break;
        case 'clear':
          console.clear();
          break;
        case 'exit':
        case 'quit':
          this.rl.close();
          break;
        default:
          console.log(`❌ Unknown command: ${command}`);
          console.log('Type "help" for available commands');
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }

  showHelp() {
    console.log('\n📋 Available Commands:');
    console.log('\n👤 Owner Management:');
    console.log('  createowner <name> [email]              - Create a new owner');
    console.log('  selectowner <name>                       - Select an owner');
    console.log('  listowners                              - List all owners');
    console.log('  currentowner                            - Show current owner info');
    
    console.log('\n🐾 Pet Management:');
    console.log('  createpet <name> [species] [sex] [age] [startWeight] - Create a new pet');
    console.log('  listpets                                - List all pets for current owner');
    console.log('  selectpet <name>                        - Select a pet');
    console.log('  currentpet                              - Show current pet info');
    
    console.log('\n⚖️ Weight Tracking:');
    console.log('  addweight <pounds> [note]               - Add weight entry');
    console.log('  weights                                 - Show weight history');
    console.log('  weightshistory [date]                   - Show weight entries for specific date');
    console.log('  setgoal <weight>                        - Set goal weight');
    
    console.log('\n🍽️ Meal Tracking:');
    console.log('  addmeal <name> <calories>               - Add meal entry');
    console.log('  meals [date]                            - Show meals for day');
    console.log('  mealshistory [date]                     - Show meal entries for specific date');
    console.log('  setcaloriegoal <calories>               - Set daily calorie goal');
    
    console.log('\n📊 Reports & Status:');
    console.log('  status                                  - Show goal status');
    console.log('  calories [date]                          - Show calories for day');
    console.log('  report [petname]                        - Generate comprehensive report');
    
    console.log('\n💾 Data Management:');
    console.log('  save [filename]                         - Save all data to localStorage');
    console.log('  load [filename]                          - Load data from localStorage');
    
    console.log('\n🔧 Utility:');
    console.log('  clear                                   - Clear screen');
    console.log('  help                                    - Show this help');
    console.log('  exit/quit                              - Exit console');
  }

  createOwner(args) {
    if (args.length < 1) {
      console.log('❌ Usage: createowner <name> [email]');
      return;
    }

    const name = args[0];
    const email = args[1] || null;

    if (this.owners.has(name)) {
      console.log(`❌ Owner "${name}" already exists`);
      return;
    }

    const owner = new Owner({ name, email });
    this.owners.set(name, owner);
    this.currentOwner = owner;

    console.log(`✅ Created owner: ${name}`);
    if (email) console.log(`   Email: ${email}`);
  }

  selectOwner(args) {
    if (args.length < 1) {
      console.log('❌ Usage: selectowner <name>');
      return;
    }

    const name = args[0];
    const owner = this.owners.get(name);
    
    if (!owner) {
      console.log(`❌ Owner "${name}" not found`);
      return;
    }

    this.currentOwner = owner;
    this.currentPet = null; // Reset current pet when switching owners
    console.log(`✅ Selected owner: ${name}`);
  }

  listOwners() {
    if (this.owners.size === 0) {
      console.log('📝 No owners created yet');
      return;
    }

    console.log('\n👤 Owners:');
    for (const [name, owner] of this.owners) {
      const current = owner === this.currentOwner ? ' (current)' : '';
      const petCount = owner.pets.length;
      console.log(`  ${name}${current}: ${petCount} pet${petCount !== 1 ? 's' : ''}`);
    }
  }

  showCurrentOwner() {
    if (!this.currentOwner) {
      console.log('❌ No owner selected');
      return;
    }

    const owner = this.currentOwner;
    console.log(`\n👤 Current Owner: ${owner.name}`);
    if (owner.email) console.log(`   Email: ${owner.email}`);
    console.log(`   Pets: ${owner.pets.length}`);
    
    if (owner.pets.length > 0) {
      console.log('   Pet List:');
      owner.pets.forEach(pet => {
        const weight = pet.latestWeight();
        const weightStr = weight ? `${weight} lbs` : 'No weight recorded';
        console.log(`     - ${pet.name} (${pet.species}): ${weightStr}`);
      });
    }
  }

  createPet(args) {
    if (!this.currentOwner) {
      console.log('❌ No owner selected. Create or select an owner first.');
      return;
    }

    if (args.length < 1) {
      console.log('❌ Usage: createpet <name> [species] [sex] [age] [startWeight]');
      return;
    }

    const name = args[0];
    const species = args[1] || 'dog';
    const sex = args[2] || 'unknown';
    const ageYears = args[3] ? Number(args[3]) : 0;
    const startWeightLb = args[4] ? Number(args[4]) : 0;

    // Check if pet already exists for this owner
    const existingPet = this.currentOwner.pets.find(p => p.name === name);
    if (existingPet) {
      console.log(`❌ Pet "${name}" already exists for owner "${this.currentOwner.name}"`);
      return;
    }

    const pet = new Pet({ name, species, sex, ageYears, startWeightLb });
    this.currentOwner.addPet(pet);
    this.currentPet = pet;

    console.log(`✅ Created pet: ${name}`);
    console.log(`   Species: ${species}, Sex: ${sex}, Age: ${ageYears} years`);
    if (startWeightLb > 0) {
      console.log(`   Starting weight: ${startWeightLb} lbs`);
    }
  }

  listPets() {
    if (!this.currentOwner) {
      console.log('❌ No owner selected');
      return;
    }

    if (this.currentOwner.pets.length === 0) {
      console.log('📝 No pets created yet');
      return;
    }

    console.log(`\n🐾 Pets for ${this.currentOwner.name}:`);
    this.currentOwner.pets.forEach((pet, index) => {
      const current = pet === this.currentPet ? ' (current)' : '';
      const weight = pet.latestWeight();
      const weightStr = weight ? `${weight} lbs` : 'No weight recorded';
      console.log(`  ${index + 1}. ${pet.name}${current}: ${weightStr}`);
    });
  }

  selectPet(args) {
    if (!this.currentOwner) {
      console.log('❌ No owner selected');
      return;
    }

    if (args.length < 1) {
      console.log('❌ Usage: selectpet <name>');
      return;
    }

    const name = args[0];
    const pet = this.currentOwner.pets.find(p => p.name === name);
    
    if (!pet) {
      console.log(`❌ Pet "${name}" not found for owner "${this.currentOwner.name}"`);
      return;
    }

    this.currentPet = pet;
    console.log(`✅ Selected pet: ${name}`);
  }

  showCurrentPet() {
    if (!this.currentPet) {
      console.log('❌ No pet selected');
      return;
    }

    const pet = this.currentPet;
    console.log(`\n🐾 Current Pet: ${pet.name}`);
    console.log(`   Species: ${pet.species}`);
    console.log(`   Sex: ${pet.sex}`);
    console.log(`   Age: ${pet.ageYears} years`);
    console.log(`   Latest weight: ${pet.latestWeight() || 'Not recorded'} lbs`);
    console.log(`   Goal weight: ${pet.goalWeightLb || 'Not set'} lbs`);
    console.log(`   Daily calorie goal: ${pet.dailyCalorieGoal || 'Not set'} kcal`);
    console.log(`   Weight entries: ${pet.weightLog.length}`);
    console.log(`   Meal entries: ${pet.meals.length}`);
  }

  addWeight(args) {
    if (!this.currentPet) {
      console.log('❌ No pet selected');
      return;
    }

    if (args.length < 1) {
      console.log('❌ Usage: addweight <pounds> [note]');
      return;
    }

    const pounds = Number(args[0]);
    const note = args.slice(1).join(' ') || '';

    const entry = this.currentPet.addWeight(pounds, { note });
    console.log(`✅ Added weight: ${pounds} lbs`);
    if (note) console.log(`   Note: ${note}`);
    console.log(`   Date: ${entry.date.toLocaleDateString()}`);
  }

  addMeal(args) {
    if (!this.currentPet) {
      console.log('❌ No pet selected');
      return;
    }

    if (args.length < 2) {
      console.log('❌ Usage: addmeal <name> <calories>');
      return;
    }

    const name = args[0];
    const calories = Number(args[1]);

    const meal = this.currentPet.addMeal(name, calories);
    console.log(`✅ Added meal: ${name} (${calories} calories)`);
    console.log(`   Date: ${meal.date.toLocaleDateString()}`);
  }

  setGoal(args) {
    if (!this.currentPet) {
      console.log('❌ No pet selected');
      return;
    }

    if (args.length < 1) {
      console.log('❌ Usage: setgoal <weight>');
      return;
    }

    const weight = Number(args[0]);
    this.currentPet.setGoalWeight(weight);
    console.log(`✅ Set goal weight: ${weight} lbs`);
  }

  setCalorieGoal(args) {
    if (!this.currentPet) {
      console.log('❌ No pet selected');
      return;
    }

    if (args.length < 1) {
      console.log('❌ Usage: setcaloriegoal <calories>');
      return;
    }

    const calories = Number(args[0]);
    this.currentPet.setDailyCalorieGoal(calories);
    console.log(`✅ Set daily calorie goal: ${calories} kcal`);
  }

  showStatus() {
    if (!this.currentPet) {
      console.log('❌ No pet selected');
      return;
    }

    const pet = this.currentPet;
    const weightStatus = pet.goalStatus();
    const calorieStatus = pet.caloriesStatusOn();

    console.log(`\n📊 Status for ${pet.name}:`);
    console.log(`   Weight Status: ${this.formatWeightStatus(weightStatus)}`);
    console.log(`   Calories Today: ${calorieStatus.intake} kcal (${this.formatCalorieStatus(calorieStatus.status)})`);
  }

  showCalories(args) {
    if (!this.currentPet) {
      console.log('❌ No pet selected');
      return;
    }

    const date = args[0] ? new Date(args[0]) : new Date();
    const calories = this.currentPet.caloriesOn(date);
    const status = this.currentPet.caloriesStatusOn(date);

    console.log(`\n🍽️ Calories for ${date.toLocaleDateString()}:`);
    console.log(`   Total: ${calories} kcal`);
    console.log(`   Status: ${this.formatCalorieStatus(status.status)}`);
    if (this.currentPet.dailyCalorieGoal) {
      console.log(`   Goal: ${this.currentPet.dailyCalorieGoal} kcal`);
    }
  }

  showWeights() {
    if (!this.currentPet) {
      console.log('❌ No pet selected');
      return;
    }

    const weights = this.currentPet.weightLog;
    if (weights.length === 0) {
      console.log('📝 No weight entries recorded');
      return;
    }

    console.log(`\n⚖️ Weight History for ${this.currentPet.name}:`);
    weights.forEach((entry, index) => {
      console.log(`   ${index + 1}. ${entry.pounds} lbs - ${entry.date.toLocaleDateString()}`);
      if (entry.note) console.log(`      Note: ${entry.note}`);
    });
  }

  showMeals(args) {
    if (!this.currentPet) {
      console.log('❌ No pet selected');
      return;
    }

    const date = args[0] ? new Date(args[0]) : new Date();
    const dayMeals = this.currentPet.meals.filter(meal => {
      const mealDate = new Date(meal.date);
      return mealDate.toDateString() === date.toDateString();
    });

    if (dayMeals.length === 0) {
      console.log(`📝 No meals recorded for ${date.toLocaleDateString()}`);
      return;
    }

    console.log(`\n🍽️ Meals for ${date.toLocaleDateString()}:`);
    dayMeals.forEach((meal, index) => {
      console.log(`   ${index + 1}. ${meal.name} - ${meal.calories} calories`);
    });
    console.log(`   Total: ${this.currentPet.caloriesOn(date)} calories`);
  }

  showWeightsHistory(args) {
    if (!this.currentPet) {
      console.log('❌ No pet selected');
      return;
    }

    const targetDate = args[0] ? new Date(args[0]) : new Date();
    const dayWeights = this.currentPet.weightLog.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.toDateString() === targetDate.toDateString();
    });

    if (dayWeights.length === 0) {
      console.log(`📝 No weight entries recorded for ${targetDate.toLocaleDateString()}`);
      return;
    }

    console.log(`\n⚖️ Weight Entries for ${targetDate.toLocaleDateString()}:`);
    dayWeights.forEach((entry, index) => {
      console.log(`   ${index + 1}. ${entry.pounds} lbs - ${entry.date.toLocaleTimeString()}`);
      if (entry.note) console.log(`      Note: ${entry.note}`);
    });
  }

  showMealsHistory(args) {
    if (!this.currentPet) {
      console.log('❌ No pet selected');
      return;
    }

    const targetDate = args[0] ? new Date(args[0]) : new Date();
    const dayMeals = this.currentPet.meals.filter(meal => {
      const mealDate = new Date(meal.date);
      return mealDate.toDateString() === targetDate.toDateString();
    });

    if (dayMeals.length === 0) {
      console.log(`📝 No meal entries recorded for ${targetDate.toLocaleDateString()}`);
      return;
    }

    console.log(`\n🍽️ Meal Entries for ${targetDate.toLocaleDateString()}:`);
    dayMeals.forEach((meal, index) => {
      console.log(`   ${index + 1}. ${meal.name} - ${meal.calories} calories - ${meal.date.toLocaleTimeString()}`);
    });
    console.log(`   Total: ${this.currentPet.caloriesOn(targetDate)} calories`);
  }

  generateReport(args) {
    if (!this.currentOwner) {
      console.log('❌ No owner selected');
      return;
    }

    const petName = args[0];
    let pets = this.currentOwner.pets;
    
    if (petName) {
      const pet = this.currentOwner.pets.find(p => p.name === petName);
      if (!pet) {
        console.log(`❌ Pet "${petName}" not found`);
        return;
      }
      pets = [pet];
    }

    console.log(`\n📊 Comprehensive Report for ${this.currentOwner.name}:`);
    console.log('=' .repeat(50));
    
    pets.forEach(pet => {
      console.log(`\n🐾 ${pet.name} (${pet.species}):`);
      console.log(`   Age: ${pet.ageYears} years, Sex: ${pet.sex}`);
      console.log(`   Latest Weight: ${pet.latestWeight() || 'Not recorded'} lbs`);
      console.log(`   Goal Weight: ${pet.goalWeightLb || 'Not set'} lbs`);
      console.log(`   Daily Calorie Goal: ${pet.dailyCalorieGoal || 'Not set'} kcal`);
      
      const weightStatus = pet.goalStatus();
      const calorieStatus = pet.caloriesStatusOn();
      console.log(`   Weight Status: ${this.formatWeightStatus(weightStatus)}`);
      console.log(`   Calorie Status: ${this.formatCalorieStatus(calorieStatus.status)} (${calorieStatus.intake} kcal today)`);
      
      console.log(`   Total Weight Entries: ${pet.weightLog.length}`);
      console.log(`   Total Meal Entries: ${pet.meals.length}`);
      
      if (pet.weightLog.length > 0) {
        const firstWeight = pet.weightLog[0].pounds;
        const lastWeight = pet.weightLog[pet.weightLog.length - 1].pounds;
        const weightChange = lastWeight - firstWeight;
        console.log(`   Weight Change: ${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)} lbs`);
      }
    });
  }

  saveData(args) {
    const filename = args[0] || 'pet-data';
    
    try {
      const data = {
        owners: Array.from(this.owners.values()).map(owner => owner.toJSON()),
        currentOwnerName: this.currentOwner?.name || null,
        currentPetName: this.currentPet?.name || null
      };
      
      localStorage.setItem(filename, JSON.stringify(data));
      console.log(`✅ Saved all data to localStorage with key: ${filename}`);
    } catch (error) {
      console.log('❌ Failed to save data to localStorage');
    }
  }

  loadData(args) {
    if (args.length < 1) {
      console.log('❌ Usage: load <filename>');
      return;
    }

    const filename = args[0];
    
    try {
      const data = localStorage.getItem(filename);
      if (!data) {
        console.log(`❌ No data found with key: ${filename}`);
        return;
      }

      const parsedData = JSON.parse(data);
      
      // Clear current data
      this.owners.clear();
      this.currentOwner = null;
      this.currentPet = null;
      
      // Load owners
      parsedData.owners.forEach(ownerData => {
        const owner = Owner.fromJSON(ownerData);
        this.owners.set(owner.name, owner);
      });
      
      // Restore current selections
      if (parsedData.currentOwnerName) {
        this.currentOwner = this.owners.get(parsedData.currentOwnerName);
        if (this.currentOwner && parsedData.currentPetName) {
          this.currentPet = this.currentOwner.pets.find(p => p.name === parsedData.currentPetName);
        }
      }
      
      console.log(`✅ Loaded data from localStorage: ${filename}`);
      console.log(`   Loaded ${this.owners.size} owner(s)`);
    } catch (error) {
      console.log('❌ Failed to load data from localStorage');
    }
  }

  formatWeightStatus(status) {
    const statusMap = {
      'NO_GOAL': 'No goal set',
      'NO_WEIGHT': 'No weight recorded',
      'MET': '✅ Goal met!',
      'ABOVE': '⚠️ Above goal',
      'BELOW': '📈 Below goal'
    };
    return statusMap[status] || status;
  }

  formatCalorieStatus(status) {
    const statusMap = {
      'NO_GOAL': 'No goal set',
      'UNDER': '📉 Under goal',
      'MET': '✅ Goal met!',
      'OVER': '⚠️ Over goal'
    };
    return statusMap[status] || status;
  }
}

// Start the console
const petConsole = new EnhancedPetConsole();
