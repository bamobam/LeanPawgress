import { makeId } from './ids.js';
import { Pet } from './pet.js';

export class Owner {
  constructor({ name, email = null }) {
    this.id = makeId();
    this.name = name;
    this.email = email;
    this.pets = []; // Pet[]
  }

  addPet(pet) { this.pets.push(pet); return pet; }
  removePet(petId) { this.pets = this.pets.filter(p => p.id !== petId); }
  getPet(petId) { return this.pets.find(p => p.id === petId) ?? null; }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      pets: this.pets.map(p => p.toJSON())
    };
  }
  static fromJSON(o) {
    const ow = new Owner({ name: o.name, email: o.email });
    ow.id = o.id;
    ow.pets = (o.pets || []).map(Pet.fromJSON);
    return ow;
  }
}
