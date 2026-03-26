import { v4 as uuidv4 } from 'uuid';

const storageService = {
  getAll(key) {
    const data = localStorage.getItem(`sms_${key}`);
    return data ? JSON.parse(data) : [];
  },

  getById(key, id) {
    const items = this.getAll(key);
    return items.find((item) => item.id === id) || null;
  },

  create(key, item) {
    const items = this.getAll(key);
    const newItem = { ...item, id: item.id || uuidv4(), createdAt: new Date().toISOString() };
    items.push(newItem);
    localStorage.setItem(`sms_${key}`, JSON.stringify(items));
    return newItem;
  },

  update(key, id, updates) {
    const items = this.getAll(key);
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
    localStorage.setItem(`sms_${key}`, JSON.stringify(items));
    return items[index];
  },

  remove(key, id) {
    const items = this.getAll(key);
    const filtered = items.filter((item) => item.id !== id);
    localStorage.setItem(`sms_${key}`, JSON.stringify(filtered));
    return filtered;
  },

  search(key, filters = {}) {
    let items = this.getAll(key);
    Object.entries(filters).forEach(([field, value]) => {
      if (value === '' || value === null || value === undefined) return;
      items = items.filter((item) => {
        const itemVal = item[field];
        if (itemVal === undefined) return false;
        if (typeof itemVal === 'string') return itemVal.toLowerCase().includes(String(value).toLowerCase());
        return itemVal === value;
      });
    });
    return items;
  },

  setAll(key, items) {
    localStorage.setItem(`sms_${key}`, JSON.stringify(items));
  },
};

export default storageService;
