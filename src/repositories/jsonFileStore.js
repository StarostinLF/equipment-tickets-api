import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

async function readJsonFile(filePath) {
  try {
    const raw = await readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function writeJsonFile(filePath, data) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export function createCollectionStore(dataFile) {
  let loadPromise = null;
  let writeQueue = Promise.resolve();

  function load() {
    if (!loadPromise) {
      loadPromise = readJsonFile(dataFile).then(
        (items) => new Map(items.map((item) => [item.id, item])),
      );
    }
    return loadPromise;
  }

  function persist() {
    writeQueue = writeQueue.then(async () => {
      const map = await load();
      await writeJsonFile(dataFile, [...map.values()]);
    });
    return writeQueue;
  }

  return { load, persist };
}
