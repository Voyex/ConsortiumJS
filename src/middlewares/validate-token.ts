import jwt from 'jsonwebtoken';
import { VerifyErrors } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { UserData } from '../models/user/user-data.model';
// Enable the use of environment variables
dotenv.config();

/**
 * A piece of middleware that authenticates the JWT provided
 * @param {Request} req HTTPS Request
 * @param {Response} res HTTPS Response
 * @param {NextFunction} next continue from the middleware
 * @returns {void}
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  // DEV Code: Don't authenticate if you are not in production
  // if (args.isProd === 'false') {
  //   return next();
  // }

  // Reject requests made over HTTP
  if (!req.secure) {
    console.warn('Call made to confidential function over HTTP');
    res.status(505).send();
    return;
  }

  const accessToken = req.cookies?.accessToken;

  if (!accessToken) {
    res.status(401).send();
    return;
  }

  const secret = process.env?.ACCESS_TOKEN_SECRET ?? ''; // Make sure the secret exists
  jwt.verify(accessToken, secret, (err: VerifyErrors | null, payload: any): void => {
    payload as UserData;

    if (err) {
      res.status(403).send();
      return;
    }
    // Grab data from the payload and add it to the request
    req.body.email = payload.email;
    req.body.id = payload.id;
    return next();
  });
};
