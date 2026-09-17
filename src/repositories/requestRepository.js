import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { readJsonFile, writeJsonFile } from './jsonFileStore.js';

const DATA_FILE = path.join(process.cwd(), 'data', 'requests.json');
const OPEN_STATUSES = ['new', 'in_progress'];

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

function matchesDateRange(value, from, to) {
  if (!from && !to) return true;
  if (!value) return false;
  const time = new Date(value).getTime();
  if (from && time < new Date(from).getTime()) return false;
  if (to && time > new Date(to).getTime()) return false;
  return true;
}

export const requestRepository = {
  async findAll({ equipmentId, status, priority, createdFrom, createdTo, sort, order, page, limit }) {
    const all = await loadStore();
    let items = [...all.values()];

    if (equipmentId) items = items.filter((item) => item.equipmentId === equipmentId);
    if (status) items = items.filter((item) => item.status === status);
    if (priority) items = items.filter((item) => item.priority === priority);
    if (createdFrom || createdTo) {
      items = items.filter((item) => matchesDateRange(item.createdAt, createdFrom, createdTo));
    }

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

  async hasOpenByEquipmentId(equipmentId) {
    const all = await loadStore();
    return [...all.values()].some(
      (item) => item.equipmentId === equipmentId && OPEN_STATUSES.includes(item.status),
    );
  },

  async create(data) {
    const all = await loadStore();
    const now = new Date().toISOString();
    const request = {
      id: randomUUID(),
      ...data,
      status: 'new',
      createdAt: now,
      updatedAt: now,
    };
    all.set(request.id, request);
    await persist();
    return request;
  },

  async update(id, patch) {
    const all = await loadStore();
    const existing = all.get(id);
    if (!existing) return null;
    const updated = {
      ...existing,
      ...patch,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };
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
