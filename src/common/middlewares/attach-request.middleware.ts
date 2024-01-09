import { Request, Response, NextFunction } from 'express';
import { requestStorage } from '../async-storages/request.storage';

/**
 * Attach request object to current code execution
 */
export function attachRequestMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  requestStorage.run(req, () => next());
}
