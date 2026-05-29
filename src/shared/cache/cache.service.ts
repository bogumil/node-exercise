import { LRUCache } from 'lru-cache';

const TEN_MINUTES_MS = 10 * 60 * 1000;

// Needed, because cache value has to satisfy V extends {}.
type CacheEntry<T> = {
  value: T;
};

export const cache = new LRUCache<string, CacheEntry<unknown>>({
  max: 500,
  ttl: TEN_MINUTES_MS,
});

export async function getOrSet<T>(key: string, loader: () => Promise<T>): Promise<T> {
  const cached = cache.get(key);

  if (cached !== undefined) {
    return cached.value as T;
  }

  const value = await loader();
  cache.set(key, { value });
  return value;
}

export function invalidatePrefix(prefix: string): void {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
}

export function invalidateKey(key: string): void {
  cache.delete(key);
}

export function isCacheReady(): boolean {
  return cache.size >= 0;
}
