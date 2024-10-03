import MonaAPI from 'mona-js-sdk';
import { ExpectedLevelDataFromClient, LevelType } from '../../../common/types.js';

export class CustomLevelsAPI {
  constructor() {}

  getCustomLevelsByAuthor = async (author: string, search?: string) => {
    return await this._fetch<{ success: true; levels: LevelType[] }>(`/api/levels/by/${author}`, {
      method: 'POST',
      body: JSON.stringify({ search })
    });
  };

  getCustomLevels = async (page: number, search?: string) => {
    return await this._fetch<{ success: true; levels: LevelType[]; page: number }>('/api/levels', {
      method: 'POST',
      body: JSON.stringify({ page, search })
    });
  };

  updateLevel = async (level: ExpectedLevelDataFromClient & { importedId?: number }) => {
    return await this._fetch<{ success: true; levels: LevelType }>('/api/levels/update', {
      method: 'POST',
      body: JSON.stringify(level)
    });
  };

  addLevel = async (level: ExpectedLevelDataFromClient) => {
    return await this._fetch<{ success: true; levels: LevelType }>('/api/levels/add', {
      method: 'POST',
      body: JSON.stringify(level)
    });
  };

  private _fetch = async <Data extends any, E extends { error: string } = never>(url: string, options: RequestInit) => {
    const opt = {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
        ...(MonaAPI.bearer ? { Authorization: `Bearer ${MonaAPI.bearer}` } : {})
      }
    };
    try {
      const response = await fetch(url, opt);

      if (response.status === 400) {
        const e = await response.text();
        return { error: e };
      } else if (response.status === 401) {
        const e = (await response.json()) as E;
        return { error: e };
      }
      return (await response.json()) as Data;
    } catch (e) {
      console.error(e);
      return { error: 'Network Error' };
    }
  };
}
