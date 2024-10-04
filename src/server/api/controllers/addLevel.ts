import express from 'express';
import getParams from '../utils';
import { ExpectedLevelDataFromClient, LevelType } from '../../../common/types';
import { validateLevelData } from './validate';
import { pg } from '../../lib/pg';

export const addLevel = async (req: express.Request, res: express.Response) => {
  const params = getParams<ExpectedLevelDataFromClient>(req);

  const errorFromValidation = validateLevelData(params);

  if (errorFromValidation) {
    res.json({ success: false, error: errorFromValidation });
    return;
  }

  // Check user owns the level
  const { username, wallets } = req._user!;

  // Check if any level has the same name
  const validationResponse = await pg.query<LevelType>(
    `
      select * from levels
      where lower(name) = lower($1)`,
    [params.name]
  );

  if (validationResponse?.rows.length) {
    return res.json({ success: false, error: 'Level with the same name already exists' });
  }

  try {
    const queryResponse = await pg.query<LevelType>(
      `
        INSERT INTO levels (name, description, author, wallet, total_ammo, content, image_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
      [params.name, params.description, username, wallets[0] || null, params.total_ammo, JSON.stringify(params.content), params.image_url || null]
    );

    const levels = queryResponse?.rows || [];

    return res.json({ success: true, levels });
  } catch (e: any) {
    return res.json({ success: false, error: e.message });
  }
};
