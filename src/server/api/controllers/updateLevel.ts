import express from 'express';
import getParams from '../utils';
import { ExpectedLevelDataFromClient, LevelType } from '../../../common/types';
import { validateLevelData } from './validate';
import { pg } from '../../lib/pg';

export const updateLevel = async (req: express.Request, res: express.Response) => {
  const params = getParams<ExpectedLevelDataFromClient & { importedId: number }>(req);
  const id = Number(params.importedId);

  if (!params.importedId) {
    return res.json({ success: false, error: 'No level id provided' });
  }

  if (isNaN(id)) {
    return res.json({ success: false, error: 'Invalid level id provided' });
  }

  const errorFromValidation = validateLevelData(params);

  if (errorFromValidation) {
    res.json({ success: false, error: errorFromValidation });
    return;
  }

  // Check owner of the level
  const { username, wallets } = req._user!;

  const level = await pg.query<LevelType>(`SELECT * FROM levels WHERE id = $1`, [id]);

  if (!level?.rows.length) {
    return res.json({ success: false, error: 'Level not found' });
  }

  if (level.rows[0].author.toLowerCase() !== username.toLowerCase() || wallets.map((w) => w.toLowerCase()).indexOf(level.rows[0].wallet.toLowerCase()) === -1) {
    return res.json({ success: false, error: 'You are not the author of this level' });
  }

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
        UPDATE levels 
        set name = $1, description = $2, author = $3, wallet = $4, total_ammo = $5, content = $6, image_url = $7
        RETURNING *`,
      [params.name, params.description, username, wallets[0], params.total_ammo, JSON.stringify(params.content), params.image_url || null]
    );

    const levels = queryResponse?.rows || [];

    return res.json({ success: true, levels });
  } catch (e: any) {
    return res.json({ success: false, error: e.message });
  }
};
