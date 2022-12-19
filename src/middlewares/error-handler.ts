import { NextFunction, Request, Response } from 'express';

export const errorHander = (error: any, req: Request, res: Response, next: NextFunction): void => {
  const errorStatus: number = error?.status ?? 500;
  const errorMessage: string = error?.message ?? 'Unknown Error';
  // Send error as a response
  res.status(errorStatus).send(errorMessage);
  return;
};

export default errorHander;
