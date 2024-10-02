import express from 'express';
import getParams from './utils';
import { pg } from '../lib/pg';
import { validateLevelData } from './controllers/validate';
import { verifyUserLoggedInMiddleware } from '../lib/mona';
import { ExpectedLevelDataFromClient, LevelType } from '../../common/types';

export const ApiMiddleware = async (app: express.Express) => {
  app.post('/api/levels', async (req, res) => {
    console.log('GET /api/levels');
    const params = getParams<{ page: string; search?: string }>(req);

    const page = Number(params.page || '0');

    const limit = 10;

    const search = params.search || '';

    const queryResponse = await pg.query<LevelType>(
      `SELECT * FROM levels WHERE $3::text is null OR
      ((lower(author) ilike '%$3%') OR 
      (lower(name) ilike '%$3%') OR
      (description ilike '%$3%'))
     LIMIT coalesce($2,10) OFFSET coalesce($1,0) * coalesce($2,10)`,
      [page, limit, search?.toLowerCase() || null]
    );

    const levels = queryResponse?.rows || [];

    return res.json({ success: true, levels, page });
  });

  app.post('/api/levels/add', verifyUserLoggedInMiddleware, async (req, res) => {
    const params = getParams<ExpectedLevelDataFromClient>(req);

    const errorFromValidation = validateLevelData(params);

    if (errorFromValidation) {
      res.json({ success: false, error: errorFromValidation });
      return;
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
        INSERT INTO levels (name, description, author, total_ammo, content, image_url)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [params.name, params.description, params.author, params.total_ammo, JSON.stringify(params.content), params.image_url || null]
      );

      const levels = queryResponse?.rows || [];

      return res.json({ success: true, levels });
    } catch (e: any) {
      return res.json({ success: false, error: e.message });
    }
  });
};
