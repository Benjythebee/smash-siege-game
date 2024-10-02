import express from 'express';
import MonaAPI from 'mona-js-sdk';
import env from './env';

const api = env.VITE_MONA_APP_ID;

export const verifyUserLoggedInMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // get bearer token from request headers
  const bearerToken = req.get('Authorization');
  if (!bearerToken) {
    res.status(200).json({ success: false, error: 'No token provided' });
    return;
  }

  const strippedBearerToken = bearerToken.replace('Bearer ', '');
  //@ts-expect-error - ESM CJS weird shit
  const Constructor = MonaAPI.Mona;

  // Call the Mona API to verify the token
  const mona: MonaAPI = new Constructor({
    apiKey: api,
    autoLogin: {
      enabled: false
    }
  });
  // @ts-expect-error - More ESM - CJS bullshit
  MonaAPI.Mona.bearer = strippedBearerToken;

  const user = await mona.getUser();
  console.log(user);
  if ('error' in user) {
    res.status(200).json({ success: false, error: 'Invalid token' });
    return;
  }

  mona.logout();

  next();
};
