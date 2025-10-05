# Pet Console 🐾

An interactive console for testing and using the Pet class functionality.

## How to Run

```bash
npm run console
```

Or if you want to install it globally:
```bash
npm install -g .
console
```

## Available Commands

### Pet Management
- `create <name> [age] [sex] [startWeight]` - Create a new pet
- `list` - List all pets
- `select <name>` - Select a pet to work with
- `current` - Show current pet info

### Weight Tracking
- `addweight <pounds> [note]` - Add a weight entry
- `weights` - Show weight history
- `setgoal <weight>` - Set goal weight

### Meal Tracking
- `addmeal <name> <calories>` - Add a meal entry
- `meals [date]` - Show meals for a day
- `setcaloriegoal <calories>` - Set daily calorie goal

### Status & Reports
- `status` - Show goal status and calorie status
- `calories [date]` - Show calories for a specific day
- `weightshistory [date]` - Show weight entries for a specific date
- `mealshistory [date]` - Show meal entries for a specific date

### Data Persistence
- `save [key]` - Save current pet to localStorage
- `load <key>` - Load pet from localStorage

### Utility
- `help` - Show all commands
- `clear` - Clear screen
- `exit` or `quit` - Exit console

## Example Session

```
pet> create Mochi 4 male 32
✅ Created pet: Mochi
   Age: 4 years, Sex: male
   Starting weight: 32 lbs

pet> setgoal 28
✅ Set goal weight: 28 lbs

pet> setcaloriegoal 600
✅ Set daily calorie goal: 600 kcal

pet> addweight 31.5 weekly check
✅ Added weight: 31.5 lbs
   Note: weekly check
   Date: 1/15/2025

pet> addmeal kibble 300
✅ Added meal: kibble (300 calories)
   Date: 1/15/2025

pet> status
📊 Status for Mochi:
   Weight Status: ⚠️ Above goal
   Calories Today: 300 kcal (📉 Under goal)

pet> save
✅ Saved Mochi to localStorage with key: mochi

pet> weightshistory
⚖️ Weight Entries for 1/15/2025:
   1. 32.0 lbs - 12:00:00 AM
   2. 31.5 lbs - 2:30:00 PM
      Note: weekly check

pet> mealshistory
🍽️ Meal Entries for 1/15/2025:
   1. kibble - 300 calories - 2:30:00 PM
   Total: 300 calories
```

## Tips

- You can work with multiple pets by creating them and switching between them
- Dates are automatically set to today unless specified
- All data persists in localStorage when you save
- Use `help` anytime to see available commands
