import { Request, Response, NextFunction } from 'express';

/**
 * Middleware that verifies if a request is being made over HTTPS
 * @param {Request} req HTTPS Request
 * @param {Response} res HTTPS Response
 * @param {NextFunction} next continue from the middleware
 * @returns {void}
 */
const requireHttps = (req: Request, res: Response, next: NextFunction) => {
  // Reject requests made over HTTP
  if (!req.secure) {
    console.warn('Call made to confidential function over HTTP');
    res.status(505).send();
    return;
  }
  next();
};

module.exports = requireHttps;
