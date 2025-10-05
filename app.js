// Import the pet management classes
import { Pet } from './src/model/pet.js';
import { Owner } from './src/model/Owner.js';
import { WeightEntry, MealEntry } from './src/model/entries.js';

class PetManagementApp {
    constructor() {
        this.owners = new Map();
        this.currentOwner = null;
        this.currentPet = null;
        this.foodCatalog = [];
        this.poisonCatalog = [];
        this.userFoodsKey = 'lp:userFoods'; // localStorage key

        this.init();
    }

    async init() {
        await this.loadFoodCatalog();
        await this.loadPoisonCatalog();
        this.setupEventListeners();
        this.updateUI();
    }

    async loadFoodCatalog() {
        try {
          // 1) Built-in catalog
          const res = await fetch('./src/data/food-catalog.json');
          const base = await res.json();
          const baseFoods = Array.isArray(base.foods) ? base.foods : [];
      
          const normalize = (f) => {
            const name = (f.name || '').trim();
            if (!name) return null;
            let cpg = f.caloriesPerGram;
            if (cpg == null && f.kcalPerKg != null) cpg = Number(f.kcalPerKg) / 1000;
            cpg = Number(cpg);
            if (!Number.isFinite(cpg) || cpg <= 0) return null;
            return {
              id: (f.id || name.toLowerCase().replace(/\s+/g, '-')),
              name,
              type: (f.type || 'other').toLowerCase(),
              caloriesPerGram: cpg,
              description: f.description || ''
            };
          };
          const normalizedBase = baseFoods.map(normalize).filter(Boolean);
      
          // 2) User catalog from localStorage
          const userJson = localStorage.getItem(this.userFoodsKey);
          const userFoods = userJson ? JSON.parse(userJson) : [];
          const normalizedUser = userFoods.map(normalize).filter(Boolean);
      
          // Merge: user overrides by id
          const byId = new Map();
          [...normalizedBase, ...normalizedUser].forEach(f => byId.set(f.id, f));
          this.foodCatalog = [...byId.values()];
      
          this.populateFoodSelect();
        } catch (err) {
          console.error('Failed to load food catalog:', err);
          this.foodCatalog = [];
          this.populateFoodSelect();
          this.showMessage('Failed to load food catalog', 'error');
        }
      }

      async loadPoisonCatalog() {
        try {
          const res = await fetch('./src/data/poisons.json');
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const pj = await res.json();
          this.poisonCatalog = (pj.items || []).map(x => ({
            ...x,
            names: (x.names || []).map(n => n.toLowerCase()),
            species: (x.species || []).map(s => s.toLowerCase())
          }));
        } catch (e) {
          console.warn('No poisons catalog found or failed to load.', e);
          this.poisonCatalog = [];
        }
      }
      
      
      

    setupEventListeners() {
        // Owner management
        document.getElementById('createOwnerBtn').addEventListener('click', () => this.createOwner());
        
        // Pet management
        document.getElementById('createPetBtn').addEventListener('click', () => this.createPet());
        document.getElementById('savePetBtn').addEventListener('click', () => this.savePet());
        document.getElementById('cancelEditBtn').addEventListener('click', () => this.cancelEditPet());
        
        // Weight tracking
        document.getElementById('addWeightBtn').addEventListener('click', () => this.addWeight());
        document.getElementById('setGoalBtn').addEventListener('click', () => this.setWeightGoal());
        
        // Meal tracking
       // Meal tracking
        document.getElementById('addMealBtn').addEventListener('click', () => this.addMeal());
        {
        const checkBtn = document.getElementById('checkFoodBtn');
        if (checkBtn) {
            checkBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('[click] checkFoodBtn'); // debug
            this.checkFood();
            });
        } else {
            console.warn('⚠ #checkFoodBtn not found in DOM at setupEventListeners()');
        }
        }
        document.getElementById('addBrandBtn')?.addEventListener('click', () => this.addBrandToCatalog());
        document.getElementById('addFoodBtn')?.addEventListener('click', () => this.addFoodByWeight());

        document.getElementById('setCalorieGoalBtn').addEventListener('click', () => this.setCalorieGoal());
    }

    createOwner() {
        const name = document.getElementById('ownerName').value.trim();
        const email = document.getElementById('ownerEmail').value.trim();
        
        if (!name) {
            this.showMessage('Please enter an owner name', 'error');
            return;
        }
        
        if (this.owners.has(name)) {
            this.showMessage('Owner already exists', 'error');
            return;
        }
        
        const owner = new Owner({ name, email: email || null });
        this.owners.set(name, owner);
        this.currentOwner = owner;
        
        this.showMessage(`Created owner: ${name}`, 'success');
        this.updateUI();
    }

    createPet() {
        if (!this.currentOwner) {
            this.showMessage('Please create or select an owner first', 'error');
            return;
        }
        
        const name = document.getElementById('petName').value.trim();
        const species = document.getElementById('petSpecies').value;
        const sex = document.getElementById('petSex').value;
        const age = parseFloat(document.getElementById('petAge').value) || 0;
        const weight = parseFloat(document.getElementById('petWeight').value) || 0;
        
        if (!name) {
            this.showMessage('Please enter a pet name', 'error');
            return;
        }
        
        // Check if pet already exists
        const existingPet = this.currentOwner.pets.find(p => p.name === name);
        if (existingPet) {
            this.showMessage('Pet already exists for this owner', 'error');
            return;
        }
        
        const pet = new Pet({ name, species, sex, ageYears: age, startWeightLb: weight });
        this.currentOwner.addPet(pet);
        this.currentPet = pet;
        
        this.showMessage(`Created pet: ${name}`, 'success');
        this.clearPetForm();
        this.updateUI();
    }

    editPet(pet) {
        this.currentPet = pet;
        this.populateEditForm();
        document.getElementById('editPetForm').style.display = 'block';
        this.updateUI();
    }

    populateEditForm() {
        if (!this.currentPet) return;
        
        document.getElementById('editPetName').value = this.currentPet.name;
        document.getElementById('editPetSpecies').value = this.currentPet.species;
        document.getElementById('editPetSex').value = this.currentPet.sex;
        document.getElementById('editPetAge').value = this.currentPet.ageYears;
        document.getElementById('editPetPhoto').value = this.currentPet.photoUrl || '';
    }

    savePet() {
        if (!this.currentPet) return;
        
        const name = document.getElementById('editPetName').value.trim();
        const species = document.getElementById('editPetSpecies').value;
        const sex = document.getElementById('editPetSex').value;
        const age = parseFloat(document.getElementById('editPetAge').value) || 0;
        const photoUrl = document.getElementById('editPetPhoto').value.trim();
        
        if (!name) {
            this.showMessage('Please enter a pet name', 'error');
            return;
        }
        
        // Check if new name conflicts with existing pet
        const existingPet = this.currentOwner.pets.find(p => p.name === name && p !== this.currentPet);
        if (existingPet) {
            this.showMessage('Pet name already exists', 'error');
            return;
        }
        
        this.currentPet.name = name;
        this.currentPet.species = species;
        this.currentPet.sex = sex;
        this.currentPet.ageYears = age;
        this.currentPet.photoUrl = photoUrl || null;
        
        this.showMessage('Pet information updated', 'success');
        document.getElementById('editPetForm').style.display = 'none';
        this.updateUI();
    }

    cancelEditPet() {
        document.getElementById('editPetForm').style.display = 'none';
    }

    addWeight() {
        if (!this.currentPet) {
            this.showMessage('Please select a pet first', 'error');
            return;
        }
        
        const pounds = parseFloat(document.getElementById('weightValue').value);
        const note = document.getElementById('weightNote').value.trim();
        
        if (isNaN(pounds) || pounds <= 0) {
            this.showMessage('Please enter a valid weight', 'error');
            return;
        }
        
        this.currentPet.addWeight(pounds, { note });
        this.showMessage(`Added weight: ${pounds} lbs`, 'success');
        document.getElementById('weightValue').value = '';
        document.getElementById('weightNote').value = '';
        this.updateUI();
    }

    setWeightGoal() {
        if (!this.currentPet) {
            this.showMessage('Please select a pet first', 'error');
            return;
        }
        
        const goal = parseFloat(document.getElementById('goalWeight').value);
        
        if (isNaN(goal) || goal <= 0) {
            this.showMessage('Please enter a valid goal weight', 'error');
            return;
        }
        
        this.currentPet.setGoalWeight(goal);
        this.showMessage(`Set goal weight: ${goal} lbs`, 'success');
        document.getElementById('goalWeight').value = '';
        this.updateUI();
    }

    addMeal() {
        if (!this.currentPet) return this.showMessage('Please select a pet first', 'error');
      
        const name = document.getElementById('mealName').value.trim();
        const calories = parseFloat(document.getElementById('mealCalories').value);
      
        if (!name || isNaN(calories) || calories <= 0)
          return this.showMessage('Please enter valid meal name and calories', 'error');
      
        // toxic check
        const species = (this.currentPet.species || 'dog').toLowerCase();
        const toxic = this.isToxicFor(name, species);
        if (toxic) {
          const msg = `⚠ "${name}" is flagged for ${species} — ${toxic.severity.toUpperCase()}.
      Toxins: ${toxic.toxins.join(', ')}
      Symptoms: ${toxic.symptoms.join(', ')}
      ${toxic.dose_notes || ''}
      
      Add anyway?`;
          if (!confirm(msg)) return;
        }
      
        this.currentPet.addMeal(name, calories);
        this.showMessage(`Added meal: ${name} (${calories} calories)`, 'success');
        document.getElementById('mealName').value = '';
        document.getElementById('mealCalories').value = '';
        this.updateUI();
      }
      

    isToxicFor(query, species) {
        if (!query) return null;
        const q = query.toLowerCase();
        const sp = (species || '').toLowerCase();
        const hit = this.poisonCatalog.find(item =>
          (!sp || item.species.includes(sp)) &&
          (item.names.includes(q) || item.names.some(n => q.includes(n)))
        );
        return hit || null;
      }
      

      addFoodByWeight() {
        if (!this.currentPet) return this.showMessage('Please select a pet first', 'error');
      
        const foodId = document.getElementById('foodSelect').value;
        const grams = parseFloat(document.getElementById('foodGrams').value);
      
        if (!foodId || isNaN(grams) || grams <= 0)
          return this.showMessage('Please select a food and enter valid grams', 'error');
      
        const food = this.foodCatalog.find(f => f.id === foodId);
        if (!food) return this.showMessage('Food not found', 'error');
      
        // toxic check by food name
        const species = (this.currentPet.species || 'dog').toLowerCase();
        const toxic = this.isToxicFor(food.name, species);
        if (toxic) {
          const msg = `⚠ "${food.name}" is flagged for ${species} — ${toxic.severity.toUpperCase()}.
      Toxins: ${toxic.toxins.join(', ')}
      Symptoms: ${toxic.symptoms.join(', ')}
      ${toxic.dose_notes || ''}
      
      Add anyway?`;
          if (!confirm(msg)) return;
        }
      
        const calories = Math.round(food.caloriesPerGram * grams);
        const mealName = `${food.name} (${grams}g)`;
        this.currentPet.addMeal(mealName, calories);
      
        this.showMessage(`Added food: ${mealName} (${calories} cal)`, 'success');
        document.getElementById('foodGrams').value = '';
        this.updateUI();
      }
      
      checkFood() {
        console.log('[run] checkFood()');
        const q = document.getElementById('toxicQuery')?.value?.trim();
        if (!q) return this.showMessage('Enter a food to check', 'error');
      
        const species = (this.currentPet?.species || '').toLowerCase();
        const hit = this.isToxicFor(q, species);
        if (!hit) {
          return this.showMessage(`"${q}" not found in toxic list${species ? ` for ${species}` : ''}.`, 'success');
        }
        const details = [
          `Toxins: ${hit.toxins.join(', ')}`,
          `Symptoms: ${hit.symptoms.join(', ')}`,
          hit.dose_notes ? `Dose: ${hit.dose_notes}` : null
        ].filter(Boolean).join(' — ');
        this.showMessage(`☠ ${q} is DANGEROUS for ${species || hit.species.join('/')} — ${hit.severity.toUpperCase()}. ${details}`, 'error');
      }
      

      addBrandToCatalog() {
        const name = document.getElementById('brandName').value.trim();
        const type = document.getElementById('brandType').value;
        const cpg = parseFloat(document.getElementById('brandCalsPerGram').value);
        const desc = document.getElementById('brandDesc').value.trim();
      
        if (!name || !Number.isFinite(cpg) || cpg <= 0) {
          return this.showMessage('Enter a name and valid calories per gram', 'error');
        }
      
        const id = name.toLowerCase().replace(/\s+/g, '-');
      
        // load, upsert, save
        const userJson = localStorage.getItem(this.userFoodsKey);
        const list = userJson ? JSON.parse(userJson) : [];
        const idx = list.findIndex(f => (f.id || '').toLowerCase() === id);
        const entry = { id, name, type, caloriesPerGram: cpg, description: desc };
      
        if (idx >= 0) list[idx] = entry;
        else list.push(entry);
      
        localStorage.setItem(this.userFoodsKey, JSON.stringify(list));
      
        // merge into in-memory catalog (override id)
        const pos = this.foodCatalog.findIndex(f => f.id === id);
        if (pos >= 0) this.foodCatalog[pos] = entry;
        else this.foodCatalog.push(entry);
      
        this.populateFoodSelect();
        this.showMessage(`Added to your catalog: ${name} (${cpg} cal/g)`, 'success');
      
        // clear inputs
        document.getElementById('brandName').value = '';
        document.getElementById('brandCalsPerGram').value = '';
        document.getElementById('brandDesc').value = '';
      }
      
      

    setCalorieGoal() {
        if (!this.currentPet) {
            this.showMessage('Please select a pet first', 'error');
            return;
        }
        
        const calories = parseFloat(document.getElementById('calorieGoal').value);
        
        if (isNaN(calories) || calories <= 0) {
            this.showMessage('Please enter a valid calorie goal', 'error');
            return;
        }
        
        this.currentPet.setDailyCalorieGoal(calories);
        this.showMessage(`Set calorie goal: ${calories} kcal`, 'success');
        document.getElementById('calorieGoal').value = '';
        this.updateUI();
    }

    selectOwner(owner) {
        this.currentOwner = owner;
        this.currentPet = null;
        this.updateUI();
    }

    selectPet(pet) {
        this.currentPet = pet;
        this.updateUI();
    }

    populateFoodSelect() {
        const select = document.getElementById('foodSelect');
        select.innerHTML = '<option value="">Select a food...</option>';
      
        // Load user list to tag
        const userJson = localStorage.getItem(this.userFoodsKey);
        const userIds = new Set((userJson ? JSON.parse(userJson) : []).map(f => f.id));
      
        // Simple sort by name
        [...this.foodCatalog].sort((a,b) => a.name.localeCompare(b.name))
          .forEach(food => {
            const option = document.createElement('option');
            option.value = food.id;
            const star = userIds.has(food.id) ? '★ ' : '';
            option.textContent = `${star}${food.name} (${food.caloriesPerGram} cal/g)`;
            select.appendChild(option);
          });
      }
      

    updateUI() {
        this.updateOwnerSection();
        this.updatePetSection();
        this.updatePetDetailsSection();
        this.updateWeightSection();
        this.updateMealSection();
        this.updateStatusSection();
    }

    updateOwnerSection() {
        const ownerList = document.getElementById('ownerList');
        ownerList.innerHTML = '';
        
        if (this.owners.size === 0) {
            ownerList.innerHTML = '<p style="text-align: center; color: #666; font-style: italic;">No owners created yet</p>';
            return;
        }
        
        this.owners.forEach(owner => {
            const ownerItem = document.createElement('div');
            ownerItem.className = `owner-item ${owner === this.currentOwner ? 'selected' : ''}`;
            ownerItem.innerHTML = `
                <h3>${owner.name}</h3>
                <p>Email: ${owner.email || 'Not provided'}</p>
                <p>Pets: ${owner.pets.length}</p>
            `;
            ownerItem.addEventListener('click', () => this.selectOwner(owner));
            ownerList.appendChild(ownerItem);
        });
    }

    updatePetSection() {
        const petSection = document.getElementById('petSection');
        const petList = document.getElementById('petList');
        
        if (this.currentOwner) {
            petSection.style.display = 'block';
            petList.innerHTML = '';
            
            if (this.currentOwner.pets.length === 0) {
                petList.innerHTML = '<p style="text-align: center; color: #666; font-style: italic;">No pets added yet</p>';
                return;
            }
            
            this.currentOwner.pets.forEach(pet => {
                const petItem = document.createElement('div');
                petItem.className = `pet-item ${pet === this.currentPet ? 'selected' : ''}`;
                petItem.innerHTML = `
                    <h3>${pet.name}</h3>
                    <p>Species: ${pet.species} | Sex: ${pet.sex} | Age: ${pet.ageYears} years</p>
                    <p>Latest weight: ${pet.latestWeight() || 'Not recorded'} lbs</p>
                    <div style="margin-top: 10px;">
                        <button class="btn btn-secondary" onclick="app.editPet(${JSON.stringify(pet).replace(/"/g, '&quot;')})" style="margin-right: 10px;">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                    </div>
                `;
                petItem.addEventListener('click', () => this.selectPet(pet));
                petList.appendChild(petItem);
            });
        } else {
            petSection.style.display = 'none';
        }
    }

    updatePetDetailsSection() {
        const petDetailsSection = document.getElementById('petDetailsSection');
        const currentPetDiv = document.getElementById('currentPet');
        
        if (this.currentPet) {
            petDetailsSection.style.display = 'block';
            currentPetDiv.innerHTML = `
                <h3>${this.currentPet.name}</h3>
                <p>Species: ${this.currentPet.species} | Sex: ${this.currentPet.sex} | Age: ${this.currentPet.ageYears} years</p>
                <p>Latest weight: ${this.currentPet.latestWeight() || 'Not recorded'} lbs</p>
                <p>Goal weight: ${this.currentPet.goalWeightLb || 'Not set'} lbs</p>
                <p>Daily calorie goal: ${this.currentPet.dailyCalorieGoal || 'Not set'} kcal</p>
                <p>Weight entries: ${this.currentPet.weightLog.length} | Meal entries: ${this.currentPet.meals.length}</p>
            `;
        } else {
            petDetailsSection.style.display = 'none';
        }
    }

    updateWeightSection() {
        const weightSection = document.getElementById('weightSection');
        const weightHistory = document.getElementById('weightHistory');
        
        if (this.currentPet) {
            weightSection.style.display = 'block';
            weightHistory.innerHTML = '';
            
            if (this.currentPet.weightLog.length === 0) {
                weightHistory.innerHTML = '<p style="text-align: center; color: #666; font-style: italic;">No weight entries recorded</p>';
                return;
            }
            
            this.currentPet.weightLog.slice(-10).reverse().forEach(entry => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                historyItem.innerHTML = `
                    <h4>${entry.pounds} lbs</h4>
                    <p>Date: ${entry.date.toLocaleDateString()}</p>
                    ${entry.note ? `<p>Note: ${entry.note}</p>` : ''}
                `;
                weightHistory.appendChild(historyItem);
            });
        } else {
            weightSection.style.display = 'none';
        }
    }

    updateMealSection() {
        const mealSection = document.getElementById('mealSection');
        const mealHistory = document.getElementById('mealHistory');
        
        if (this.currentPet) {
            mealSection.style.display = 'block';
            mealHistory.innerHTML = '';
            
            if (this.currentPet.meals.length === 0) {
                mealHistory.innerHTML = '<p style="text-align: center; color: #666; font-style: italic;">No meals recorded</p>';
                return;
            }
            
            this.currentPet.meals.slice(-10).reverse().forEach(meal => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                historyItem.innerHTML = `
                    <h4>${meal.name}</h4>
                    <p>Calories: ${meal.calories}</p>
                    <p>Date: ${meal.date.toLocaleDateString()}</p>
                `;
                mealHistory.appendChild(historyItem);
            });
        } else {
            mealSection.style.display = 'none';
        }
    }

    updateStatusSection() {
        const statusSection = document.getElementById('statusSection');
        const statusDashboard = document.getElementById('statusDashboard');
        
        if (this.currentPet) {
            statusSection.style.display = 'block';
            
            const weightStatus = this.currentPet.goalStatus();
            const calorieStatus = this.currentPet.caloriesStatusOn();
            const latestWeight = this.currentPet.latestWeight();
            const todayCalories = this.currentPet.caloriesOn();
            
            statusDashboard.innerHTML = `
                <div class="status-card">
                    <h4>Current Weight</h4>
                    <div class="value">${latestWeight || 'N/A'}</div>
                    <div class="label">lbs</div>
                </div>
                <div class="status-card">
                    <h4>Goal Weight</h4>
                    <div class="value">${this.currentPet.goalWeightLb || 'N/A'}</div>
                    <div class="label">lbs</div>
                </div>
                <div class="status-card">
                    <h4>Weight Status</h4>
                    <div class="value">${this.formatWeightStatus(weightStatus)}</div>
                    <div class="label">Progress</div>
                </div>
                <div class="status-card">
                    <h4>Today's Calories</h4>
                    <div class="value">${todayCalories}</div>
                    <div class="label">kcal</div>
                </div>
                <div class="status-card">
                    <h4>Calorie Goal</h4>
                    <div class="value">${this.currentPet.dailyCalorieGoal || 'N/A'}</div>
                    <div class="label">kcal</div>
                </div>
                <div class="status-card">
                    <h4>Calorie Status</h4>
                    <div class="value">${this.formatCalorieStatus(calorieStatus.status)}</div>
                    <div class="label">Progress</div>
                </div>
            `;
        } else {
            statusSection.style.display = 'none';
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

    clearPetForm() {
        document.getElementById('petName').value = '';
        document.getElementById('petSpecies').value = 'dog';
        document.getElementById('petSex').value = 'male';
        document.getElementById('petAge').value = '';
        document.getElementById('petWeight').value = '';
    }

    showMessage(text, type = 'info') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());
        
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            ${text}
        `;
        
        // Insert at the top of the main content
        const mainContent = document.querySelector('.main-content');
        mainContent.insertBefore(message, mainContent.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 5000);
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new PetManagementApp();
});