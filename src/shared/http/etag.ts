import type { IncomingHttpHeaders } from 'node:http';
import type { Response } from 'express';

type RequestWithHeaders = {
  headers: IncomingHttpHeaders;
};

export function createWeakJsonEtag(value: unknown): string {
  const json = JSON.stringify(value);

  let hash = 0;

  for (let index = 0; index < json.length; index += 1) {
    hash = (hash * 31 + json.charCodeAt(index)) >>> 0;
  }

  return `W/"${hash.toString(36)}-${json.length}"`;
}

export function sendJsonWithEtag(req: RequestWithHeaders, res: Response, body: unknown): Response {
  const etag = createWeakJsonEtag(body);

  res.setHeader('ETag', etag);
  res.setHeader('Cache-Control', 'private, must-revalidate');

  if (matchesIfNoneMatch(req.headers['if-none-match'], etag)) {
    return res.status(304).send();
  }

  return res.status(200).json(body);
}

function matchesIfNoneMatch(header: string | string[] | undefined, etag: string): boolean {
  if (!header) {
    return false;
  }

  const values = Array.isArray(header) ? header : header.split(',');

  return values.some((value) => {
    const candidate = value.trim();

    return candidate === '*' || candidate === etag;
  });
}
