import * as dotenv from 'dotenv';
import { envsafe, port, str } from 'envsafe';

dotenv.config();

export const env = envsafe({
  NODE_ENV: str({
    devDefault: 'development',
    allowEmpty: true,
    desc: 'The environment the app is running in'
  }),
  DATABASE_URL: str({
    devDefault: '',
    allowEmpty: false,
    desc: 'The database connection string postgres'
  }),
  PORT: port({
    devDefault: 3000,
    default: 8080,
    desc: 'The port the server is running on'
  }),
  VITE_MONA_APP_ID: str({
    devDefault: '',
    desc: 'The Mona App ID'
  })
});

export default env;
