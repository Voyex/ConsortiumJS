import { Request, Response, NextFunction, Router } from 'express';
exports.tryCatch = (controller: Router) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await controller(req, res, next);
  } catch (error) {
    return next(error);
  }
};
