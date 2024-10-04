import express from 'express';
import getParams from '../utils';
import { LevelType } from '../../../common/types';
import { pg } from '../../lib/pg';

export const getLevels = async (req: express.Request, res: express.Response) => {
  const params = getParams<{ page: string; limit?: string; search?: string; a?: string }>(req);

  const page = Number(params.page || '0');

  const author = params.a;

  const limit = Number(params.page || '10');

  const search = params.search || '';

  const queryResponse = await pg.query<LevelType>(
    `SELECT * FROM levels WHERE ($4::text is not null AND lower($4::text)=lower(author)) OR ($3::text is null OR
      ((lower(author) ilike '%$3%') OR 
      (lower(name) ilike '%$3%') OR
      (description ilike '%$3%')))
     LIMIT coalesce($2,10) OFFSET coalesce($1,0) * coalesce($2,10)`,
    [page, limit, search?.toLowerCase() || null, author || null]
  );

  const levels = queryResponse?.rows || [];

  return res.json({ success: true, levels, page });
};
