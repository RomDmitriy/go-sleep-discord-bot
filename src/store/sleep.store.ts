import { readFile } from 'fs';
import { writeFile } from 'fs/promises';
import path from 'path';
import { adjustTimeToUTC } from '../utils/time.utils';

const DATA_PATH = path.join(__dirname, '..', 'sleepData.json');

interface IDays {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

class SleepUser {
  constructor(startTime: string, endTime: string, utcOffset: number) {
    this.isEnabled = true;
    this.utcOffset = utcOffset;
    this.interval = {
      startTime,
      endTime,
    };
    this.intervalUTC = {
      startTime: adjustTimeToUTC(startTime, utcOffset),
      endTime: adjustTimeToUTC(endTime, utcOffset),
    };
    this.days = {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true,
    };
  }

  isEnabled: boolean;
  utcOffset?: number;
  interval: {
    startTime: string;
    endTime: string;
  };
  intervalUTC: {
    startTime: string;
    endTime: string;
  };
  days: IDays;
}

type SleepDataType = Record<string, SleepUser>;

class SleepStore {
  constructor() {
    this.loadSleepData();
  }

  sleepData: SleepDataType = {};

  async setInterval(userId: string, startTime: string, endTime: string, utcOffset: number): Promise<void> {
    if (!this.sleepData[userId]) this.sleepData[userId] = new SleepUser(startTime, endTime, utcOffset);
    else {
      this.sleepData[userId].interval = {
        startTime,
        endTime,
      };
      this.sleepData[userId].utcOffset = utcOffset;

      this.sleepData[userId].intervalUTC = {
        startTime: adjustTimeToUTC(startTime, this.sleepData[userId].utcOffset),
        endTime: adjustTimeToUTC(endTime, this.sleepData[userId].utcOffset),
      };
    }

    return this.saveSleepData();
  }

  async setStatus(userId: string, isEnabled: boolean): Promise<boolean> {
    const user = this.sleepData[userId];
    if (!user) return false;

    user.isEnabled = isEnabled;
    await this.saveSleepData();
    return true;
  }

  async setDays(userId: string, days: IDays) {
    const user = this.sleepData[userId];
    if (!user) return false;

    user.days = days;
    await this.saveSleepData();
    return true;
  }

  getUser(userId: string): SleepUser | null {
    return this.sleepData[userId];
  }

  getUsers(): SleepDataType {
    return this.sleepData;
  }

  async loadSleepData(): Promise<void> {
    try {
      readFile(DATA_PATH, { encoding: 'utf-8' }, (err, data) => {
        if (err) throw err;

        const parsed = JSON.parse(data) as SleepDataType;
        for (const user in parsed) {
          this.sleepData[user] = parsed[user];
        }
      });
    } catch {
      throw Error('Error while read sleep data');
    }
  }

  private async saveSleepData() {
    await writeFile(DATA_PATH, JSON.stringify(this.sleepData, null, 2), 'utf-8');
  }
}

export const sleepStore = new SleepStore();
