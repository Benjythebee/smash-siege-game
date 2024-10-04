import express from 'express';
import { verifyUserLoggedInMiddleware } from '../lib/mona';
import { addLevel } from './controllers/addLevel';
import { getLevels } from './controllers/getLevels';
import { getLevelsByAuthor } from './controllers/getLevelsByAuthor';
import { updateLevel } from './controllers/updateLevel';

export const ApiMiddleware = async (app: express.Express) => {
  app.post('/api/levels', getLevels);

  app.post('/api/levels/add', verifyUserLoggedInMiddleware, addLevel);

  app.post('/api/levels/update', verifyUserLoggedInMiddleware, updateLevel);

  app.post('/api/levels/by/:author', getLevelsByAuthor);
};
