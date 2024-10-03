import express from 'express';
import getParams from '../utils';
import { LevelType } from '../../../common/types';
import { pg } from '../../lib/pg';

export const getLevelsByAuthor = async (req: express.Request, res: express.Response) => {
  const params = getParams<{ search?: string; author?: string }>(req);

  const author = params.author;
  console.log('author', author);
  if (!author) {
    return res.json({ success: false, error: 'No author provided', levels: [] });
  }

  const search = params.search || '';

  const queryResponse = await pg.query<LevelType>(
    `SELECT * FROM levels WHERE lower($2::text)=lower(author) AND ($1::text is null OR
      ((lower(author) ilike '%$1%') OR 
      (lower(name) ilike '%$1%') OR
      (description ilike '%$1%')))
     `,
    [search?.toLowerCase() || null, author || null]
  );

  const levels = queryResponse?.rows || [];

  return res.json({ success: true, levels });
};
