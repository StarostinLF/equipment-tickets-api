import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { createCollectionStore } from './jsonFileStore.js';

const store = createCollectionStore(path.join(process.cwd(), 'data', 'equipment.json'));

export const equipmentRepository = {
  async findAll({ type, status, sort, order, page, limit }) {
    const all = await store.load();
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
    const all = await store.load();
    return all.get(id) ?? null;
  },

  async findBySerialNumber(serialNumber) {
    const all = await store.load();
    return [...all.values()].find((item) => item.serialNumber === serialNumber) ?? null;
  },

  async create(data) {
    const all = await store.load();
    const equipment = { id: randomUUID(), ...data };
    all.set(equipment.id, equipment);
    await store.persist();
    return equipment;
  },

  async update(id, patch) {
    const all = await store.load();
    const existing = all.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...patch, id: existing.id };
    all.set(id, updated);
    await store.persist();
    return updated;
  },

  async remove(id) {
    const all = await store.load();
    const existed = all.delete(id);
    if (existed) await store.persist();
    return existed;
  },
};
