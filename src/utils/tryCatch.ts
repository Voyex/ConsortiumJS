import { Request, Response, NextFunction, Router } from 'express';

const tryCatch = (controller: any) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await controller(req, res, next);
  } catch (error: unknown) {
    return next(error);
  }
};

export default tryCatch;
