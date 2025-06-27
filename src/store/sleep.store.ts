import fs from 'fs/promises';
import path from 'path';

export interface SleepUser {
  startTime: string;
  endTime: string;
}

export type SleepData = Record<string, SleepUser>;

const DATA_FILE = path.join(__dirname, '..', 'sleepData.json');

export async function loadSleepData(): Promise<SleepData> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export async function saveSleepData(data: SleepData) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}
