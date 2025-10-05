import { Owner } from './Owner.js';

export function saveOwners(owners) {
  try {
    const data = owners.map(owner => owner.toJSON());
    localStorage.setItem('owners', JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save owners to localStorage:', error);
    return false;
  }
}

export function loadOwners() {
  try {
    const data = localStorage.getItem('owners');
    if (!data) return [];
    const ownersData = JSON.parse(data);
    return ownersData.map(ownerData => Owner.fromJSON(ownerData));
  } catch (error) {
    console.error('Failed to load owners from localStorage:', error);
    return [];
  }
}
