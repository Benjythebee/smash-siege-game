import express from 'express';
import { MonaUser } from 'mona-js-sdk';

declare global {
  declare namespace Express {
    interface Request {
      _user?: MonaUser;
    }
  }
}
