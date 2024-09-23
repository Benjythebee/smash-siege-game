import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import ViteExpress from 'vite-express';

import { Express } from 'express-serve-static-core';
import { ApiMiddleware } from './api/router';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { PORT = 3001 } = process.env;

const app = express();

// Middleware that parses json and looks at requests where the Content-Type header matches the type option.
app.use(express.json());

app.use((req, res, next) => {
  console.log('Time:', Date.now(), req.method, req.url);
  next();
});

// Serve API requests from the router
ApiMiddleware(app);

ViteExpress.listen(app, Number(PORT), () => console.log(`Server listening at http://localhost:${PORT}`));
