// src/persistence/store.js
import { Owner } from '../model/Owner.js';

const STORAGE_KEY = 'leanpawgress:owners';

export function loadOwners() {
  const raw = localStorage.getItem(STORAGE_KEY);
  const arr = raw ? JSON.parse(raw) : [];
  return arr.map(Owner.fromJSON);
}

export function saveOwners(owners) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(owners.map(o => o.toJSON()))
  );
}
