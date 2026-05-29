import type { NextFunction, Request, Response } from 'express';

// todo - make this configurable within the system.
const TEN_MINUTES_SECONDS = 10 * 60;

export function setCacheControl(req: Request, res: Response, next: NextFunction) {
  if (req.method !== 'GET') {
    return next();
  }

  const originalJson = res.json.bind(res);

  res.json = (body) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      res.setHeader('Cache-Control', `public, max-age=${TEN_MINUTES_SECONDS}, must-revalidate`);
    }

    return originalJson(body);
  };

  return next();
}
