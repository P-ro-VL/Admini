import fs from 'fs/promises';
import path from 'path';
import { AppState } from './types';

const DATA_FILE = path.join(process.cwd(), 'data.json');

const DEFAULT_STATE: AppState = {
    apis: [],
    pages: [],
    settings: { theme: 'light' },
};

export async function getStorage(): Promise<AppState> {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist, return default state
        return DEFAULT_STATE;
    }
}

export async function saveStorage(state: AppState): Promise<void> {
    await fs.writeFile(DATA_FILE, JSON.stringify(state, null, 2));
}
