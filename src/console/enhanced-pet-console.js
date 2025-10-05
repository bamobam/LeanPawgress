#!/usr/bin/env node
import { Pet } from '../model/pet.js';
import { Owner } from '../model/Owner.js';
import { WeightEntry, MealEntry } from '../model/entries.js';
import readline from 'readline';
import fs from 'fs';
import path from 'path';

class EnhancedPetConsole {
  constructor() {
    this.owners = new Map(); // Store owners by name
    this.currentOwner = null;
    this.currentPet = null;
    this.foodCatalog = []; // Store food catalog
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: 'pet> '
    });

    this.loadFoodCatalog();
    this.setupEventHandlers();
    this.showWelcome();
  }

  loadFoodCatalog() {
    try {
      const catalogPath = path.join(process.cwd(), 'src', 'data', 'food-catalog.json');
      if (fs.existsSync(catalogPath)) {
        const data = fs.readFileSync(catalogPath, 'utf8');
        const catalog = JSON.parse(data);
        this.foodCatalog = catalog.foods || [];
        console.log(`📚 Loaded ${this.foodCatalog.length} food items from catalog`);
      } else {
        console.log('⚠️ Food catalog not found. Food features will be limited.');
      }
    } catch (error) {
      console.log('⚠️ Failed to load food catalog:', error.message);
    }
  }

  saveFoodCatalog() {
    try {
      const catalogPath = path.join(process.cwd(), 'src', 'data', 'food-catalog.json');
      const catalog = {
        foods: this.foodCatalog
      };
      fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2));
    } catch (error) {
      console.log('⚠️ Failed to save food catalog:', error.message);
    }
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
        case 'addmealbyweight':
          this.addMealByWeight(args);
          break;
        case 'addfoodbrand':
          this.addFoodBrand(args);
          break;
        case 'searchfood':
          this.searchFood(args);
          break;
        case 'listfoods':
          this.listFoods(args);
          break;
        case 'setweightgoal':
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
        case 'listfiles':
          this.listFiles();
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
    console.log('  setweightgoal <weight>                  - Set goal weight');
    
    console.log('\n🍽️ Meal Tracking:');
    console.log('  addmeal <name> <calories>               - Add meal entry');
    console.log('  addmealbyweight <food-name> <grams>     - Add food by weight (auto-calculates calories)');
    console.log('  addfoodbrand <name> <type> <caloriesPerGram> [description] - Add new food to catalog');
    console.log('  searchfood <search-term>               - Search for foods in catalog');
    console.log('  listfoods [type]                       - List foods by type (natural/vegetable/fruit/grain/dairy/kibble/wet/treat/all)');
    console.log('  meals [date]                            - Show meals for day');
    console.log('  mealshistory [date]                     - Show meal entries for specific date');
    console.log('  setcaloriegoal <calories>               - Set daily calorie goal');
    
    console.log('\n📊 Reports & Status:');
    console.log('  status                                  - Show goal status');
    console.log('  calories [date]                          - Show calories for day');
    console.log('  report [petname]                        - Generate comprehensive report');
    
    console.log('\n💾 Data Management:');
    console.log('  save [filename]                         - Save all data to file');
    console.log('  load [filename]                          - Load data from file');
    console.log('  listfiles                               - List all saved data files');
    
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

  addMealByWeight(args) {
    if (!this.currentPet) {
      console.log('❌ No pet selected');
      return;
    }

    if (args.length < 2) {
      console.log('❌ Usage: addmealbyweight <food-name> <grams>');
      console.log('   Use "searchfood" to find available foods');
      return;
    }

    const foodName = args.slice(0, -1).join(' '); // Everything except last argument
    const grams = Number(args[args.length - 1]);

    // Search for the food in catalog
    const food = this.foodCatalog.find(f => 
      f.name.toLowerCase().includes(foodName.toLowerCase())
    );

    if (!food) {
      console.log(`❌ Food "${foodName}" not found in catalog`);
      console.log('   Use "searchfood" to find available foods');
      return;
    }

    const calories = Math.round(food.caloriesPerGram * grams);
    const mealName = `${food.name} (${grams}g)`;

    const meal = this.currentPet.addMeal(mealName, calories);
    console.log(`✅ Added food: ${mealName}`);
    console.log(`   Calories: ${calories} (${food.caloriesPerGram} per gram)`);
    console.log(`   Date: ${meal.date.toLocaleDateString()}`);
  }

  addFoodBrand(args) {
    if (args.length < 4) {
      console.log('❌ Usage: addfoodbrand <name> <type> <caloriesPerGram> [description]');
      console.log('   Example: addfoodbrand "egg" "natural" 1.55 "Raw chicken egg"');
      return;
    }

    const name = args[0];
    const type = args[1];
    const caloriesPerGram = Number(args[2]);
    const description = args.slice(3).join(' ') || '';

    // Validate type
    const validTypes = ['natural', 'vegetable', 'fruit', 'grain', 'dairy', 'kibble', 'wet', 'treat'];
    if (!validTypes.includes(type)) {
      console.log(`❌ Invalid food type. Must be one of: ${validTypes.join(', ')}`);
      return;
    }

    // Validate calories
    if (isNaN(caloriesPerGram) || caloriesPerGram < 0) {
      console.log('❌ Calories per gram must be a non-negative number');
      return;
    }

    // Generate unique ID
    const id = name.toLowerCase().replace(/\s+/g, '-');

    // Check if food already exists
    const existingFood = this.foodCatalog.find(f => f.id === id);
    if (existingFood) {
      console.log(`❌ Food "${name}" already exists in catalog`);
      return;
    }

    // Create new food item
    const newFood = {
      id,
      name,
      type,
      caloriesPerGram,
      description
    };

    // Add to catalog
    this.foodCatalog.push(newFood);

    // Save to file
    this.saveFoodCatalog();

    console.log(`✅ Added food to catalog:`);
    console.log(`   Name: ${name}`);
    console.log(`   Type: ${type}`);
    console.log(`   Calories per gram: ${caloriesPerGram}`);
    if (description) console.log(`   Description: ${description}`);
  }

  searchFood(args) {
    if (args.length < 1) {
      console.log('❌ Usage: searchfood <search-term>');
      return;
    }

    const searchTerm = args.join(' ').toLowerCase();
    const results = this.foodCatalog.filter(food => 
      food.name.toLowerCase().includes(searchTerm) ||
      food.description.toLowerCase().includes(searchTerm) ||
      food.type.toLowerCase().includes(searchTerm)
    );

    if (results.length === 0) {
      console.log(`📝 No foods found matching "${searchTerm}"`);
      return;
    }

    console.log(`\n🔍 Food Search Results for "${searchTerm}":`);
    results.slice(0, 10).forEach((food, index) => {
      console.log(`   ${index + 1}. ${food.name}`);
      console.log(`      ${food.caloriesPerGram} cal/g - ${food.type} - ${food.description}`);
    });

    if (results.length > 10) {
      console.log(`   ... and ${results.length - 10} more results`);
    }
  }

  listFoods(args) {
    const type = args[0] || 'all';
    let foods = this.foodCatalog;

    if (type !== 'all') {
      foods = this.foodCatalog.filter(food => food.type === type);
    }

    if (foods.length === 0) {
      console.log(`📝 No foods found for type: ${type}`);
      return;
    }

    console.log(`\n🍽️ Available Foods (${type}):`);
    foods.forEach((food, index) => {
      console.log(`   ${index + 1}. ${food.name}`);
      console.log(`      ${food.caloriesPerGram} cal/g - ${food.type}`);
    });
  }

  setGoal(args) {
    if (!this.currentPet) {
      console.log('❌ No pet selected');
      return;
    }

    if (args.length < 1) {
      console.log('❌ Usage: setweightgoal <weight>');
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
      
      // Create data directory if it doesn't exist
      const dataDir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      const filePath = path.join(dataDir, `${filename}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`✅ Saved all data to file: ${filePath}`);
    } catch (error) {
      console.log(`❌ Failed to save data: ${error.message}`);
    }
  }

  loadData(args) {
    if (args.length < 1) {
      console.log('❌ Usage: load <filename>');
      return;
    }

    const filename = args[0];
    
    try {
      const dataDir = path.join(process.cwd(), 'data');
      const filePath = path.join(dataDir, `${filename}.json`);
      
      if (!fs.existsSync(filePath)) {
        console.log(`❌ No data file found: ${filePath}`);
        return;
      }

      const data = fs.readFileSync(filePath, 'utf8');
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
      
      console.log(`✅ Loaded data from file: ${filePath}`);
      console.log(`   Loaded ${this.owners.size} owner(s)`);
    } catch (error) {
      console.log(`❌ Failed to load data: ${error.message}`);
    }
  }

  listFiles() {
    try {
      const dataDir = path.join(process.cwd(), 'data');
      
      if (!fs.existsSync(dataDir)) {
        console.log('📝 No data directory found. No files saved yet.');
        return;
      }

      const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.json'));
      
      if (files.length === 0) {
        console.log('📝 No data files found.');
        return;
      }

      console.log('\n📁 Saved Data Files:');
      files.forEach(file => {
        const filePath = path.join(dataDir, file);
        const stats = fs.statSync(filePath);
        const date = stats.mtime.toLocaleDateString();
        const time = stats.mtime.toLocaleTimeString();
        console.log(`  ${file} (${date} ${time})`);
      });
    } catch (error) {
      console.log(`❌ Failed to list files: ${error.message}`);
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
