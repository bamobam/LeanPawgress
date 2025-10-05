# Enhanced Pet Management Console 🐾

A comprehensive interactive console for managing pets, owners, weight tracking, meal logging, and goal setting.

## How to Run

```bash
npm run console
```

## Features

### 👤 Owner Management
- Create and manage multiple pet owners
- Switch between different owners
- Each owner can have multiple pets

### 🐾 Pet Management
- Create pets with species, sex, age, and starting weight
- Support for dogs, cats, and other species
- Track multiple pets per owner

### ⚖️ Weight Tracking
- Log weight entries with notes and timestamps
- Set weight goals for each pet
- Track weight history and progress
- View weight entries by specific dates

### 🍽️ Meal Tracking
- Log meals with calories and timestamps
- Set daily calorie goals
- Track calorie intake vs goals
- View meal history by date

### 📊 Comprehensive Reporting
- Generate detailed reports for pets
- Track progress towards goals
- View weight changes over time
- Monitor calorie intake patterns

### 💾 Data Persistence
- Save all data to localStorage
- Load previously saved data
- Maintain owner and pet relationships

## Available Commands

### Owner Management
- `createowner <name> [email]` - Create a new owner
- `selectowner <name>` - Select an owner to work with
- `listowners` - List all owners
- `currentowner` - Show current owner info

### Pet Management
- `createpet <name> [species] [sex] [age] [startWeight]` - Create a new pet
- `listpets` - List all pets for current owner
- `selectpet <name>` - Select a pet to work with
- `currentpet` - Show current pet info

### Weight Tracking
- `addweight <pounds> [note]` - Add weight entry
- `weights` - Show complete weight history
- `weightshistory [date]` - Show weight entries for specific date
- `setweightgoal <weight>` - Set goal weight

### Meal Tracking
- `addmeal <name> <calories>` - Add meal entry
- `meals [date]` - Show meals for specific day
- `mealshistory [date]` - Show meal entries for specific date
- `setcaloriegoal <calories>` - Set daily calorie goal

### Reports & Status
- `status` - Show current goal status
- `calories [date]` - Show calories for specific day
- `report [petname]` - Generate comprehensive report

### Data Management
- `save [filename]` - Save all data to localStorage
- `load <filename>` - Load data from localStorage

### Utility
- `clear` - Clear screen
- `help` - Show all commands
- `exit/quit` - Exit console

## Example Session

```
pet> createowner John john@email.com
✅ Created owner: John
   Email: john@email.com

pet> createpet Buddy dog male 3 45
✅ Created pet: Buddy
   Species: dog, Sex: male, Age: 3 years
   Starting weight: 45 lbs

pet> setweightgoal 40
✅ Set goal weight: 40 lbs

pet> setcaloriegoal 800
✅ Set daily calorie goal: 800 kcal

pet> addweight 44.5 weekly check
✅ Added weight: 44.5 lbs
   Note: weekly check
   Date: 1/15/2025

pet> addmeal kibble 300
✅ Added meal: kibble (300 calories)
   Date: 1/15/2025

pet> addmeal chicken 200
✅ Added meal: chicken (200 calories)
   Date: 1/15/2025

pet> status
📊 Status for Buddy:
   Weight Status: ⚠️ Above goal
   Calories Today: 500 kcal (📉 Under goal)

pet> report
📊 Comprehensive Report for John:
==================================================

🐾 Buddy (dog):
   Age: 3 years, Sex: male
   Latest Weight: 44.5 lbs
   Goal Weight: 40 lbs
   Daily Calorie Goal: 800 kcal
   Weight Status: ⚠️ Above goal
   Calorie Status: 📉 Under goal (500 kcal today)
   Total Weight Entries: 2
   Total Meal Entries: 2
   Weight Change: -0.5 lbs

pet> save my-pets
✅ Saved all data to localStorage with key: my-pets
```

## Tips

- **Workflow**: Create owner → Create pets → Set goals → Log data → Generate reports
- **Multiple Owners**: Each owner maintains their own set of pets
- **Data Persistence**: Always save your work with the `save` command
- **Date Formats**: Use standard date formats (YYYY-MM-DD) for specific dates
- **Goals**: Set both weight and calorie goals for comprehensive tracking
- **Reports**: Use the `report` command to get detailed insights into pet progress

## Data Structure

The console maintains:
- **Owners**: Each with a name, email, and collection of pets
- **Pets**: Each with profile info, weight log, meal log, and goals
- **Weight Entries**: Timestamped weight records with notes
- **Meal Entries**: Timestamped meal records with calories

All data is automatically serialized and can be saved/loaded from localStorage for persistence across sessions.
