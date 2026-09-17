import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { readJsonFile, writeJsonFile } from './jsonFileStore.js';

const DATA_FILE = path.join(process.cwd(), 'data', 'equipment.json');

let store = null;

async function loadStore() {
  if (!store) {
    const items = await readJsonFile(DATA_FILE);
    store = new Map(items.map((item) => [item.id, item]));
  }
  return store;
}

async function persist() {
  await writeJsonFile(DATA_FILE, [...store.values()]);
}

export const equipmentRepository = {
  async findAll({ type, status, sort, order, page, limit }) {
    const all = await loadStore();
    let items = [...all.values()];

    if (type) items = items.filter((item) => item.type === type);
    if (status) items = items.filter((item) => item.status === status);

    const direction = order === 'desc' ? -1 : 1;
    items.sort((a, b) => {
      if (a[sort] < b[sort]) return -1 * direction;
      if (a[sort] > b[sort]) return 1 * direction;
      return 0;
    });

    const total = items.length;
    const start = (page - 1) * limit;
    const pageItems = items.slice(start, start + limit);

    return { items: pageItems, total };
  },

  async findById(id) {
    const all = await loadStore();
    return all.get(id) ?? null;
  },

  async findBySerialNumber(serialNumber) {
    const all = await loadStore();
    return [...all.values()].find((item) => item.serialNumber === serialNumber) ?? null;
  },

  async create(data) {
    const all = await loadStore();
    const equipment = { id: randomUUID(), ...data };
    all.set(equipment.id, equipment);
    await persist();
    return equipment;
  },

  async update(id, patch) {
    const all = await loadStore();
    const existing = all.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...patch, id: existing.id };
    all.set(id, updated);
    await persist();
    return updated;
  },

  async remove(id) {
    const all = await loadStore();
    const existed = all.delete(id);
    if (existed) await persist();
    return existed;
  },
};
