import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { sequelize, Site, Equipment, MaintenanceRequest } from './models/index.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const LEGACY_SITE_CODE = 'LEGACY';

async function readJson(fileName) {
  try {
    const raw = await readFile(path.join(DATA_DIR, fileName), 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    throw err;
  }
}

async function ensureLegacySite(transaction) {
  const [site] = await Site.findOrCreate({
    where: { code: LEGACY_SITE_CODE },
    defaults: {
      name: 'Импортировано из Кейса 2',
      code: LEGACY_SITE_CODE,
      region: 'Не указан',
      lat: 0,
      lon: 0,
    },
    transaction,
  });
  return site;
}

async function importEquipment(records, legacySiteId, transaction) {
  if (!records?.length) return 0;
  const rows = records.map((item) => ({
    id: item.id,
    siteId: legacySiteId,
    name: item.name,
    type: item.type,
    serialNumber: item.serialNumber,
    status: item.status,
    lat: item.location?.lat ?? 0,
    lon: item.location?.lon ?? 0,
    installedAt: item.installedAt,
  }));
  const created = await Equipment.bulkCreate(rows, { ignoreDuplicates: true, transaction });
  return created.length;
}

async function importRequests(records, transaction) {
  if (!records?.length) return 0;
  const rows = records.map((item) => ({
    id: item.id,
    equipmentId: item.equipmentId,
    title: item.title,
    description: item.description ?? null,
    priority: item.priority,
    status: item.status,
    plannedAt: item.plannedAt ?? null,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }));
  const created = await MaintenanceRequest.bulkCreate(rows, { ignoreDuplicates: true, transaction });
  return created.length;
}

async function run() {
  const [equipmentData, requestData] = await Promise.all([
    readJson('equipment.json'),
    readJson('requests.json'),
  ]);

  if (!equipmentData && !requestData) {
    console.log('Файлы data/equipment.json и data/requests.json не найдены — переносить нечего.');
    return;
  }

  await sequelize.transaction(async (transaction) => {
    const legacySite = await ensureLegacySite(transaction);
    const equipmentCount = await importEquipment(equipmentData, legacySite.id, transaction);
    const requestCount = await importRequests(requestData, transaction);
    console.log(`Перенесено оборудования: ${equipmentCount}, заявок: ${requestCount}`);
  });
}

run()
  .catch((err) => {
    console.error('Перенос данных завершился ошибкой:', err.message);
    process.exitCode = 1;
  })
  .finally(() => sequelize.close());
