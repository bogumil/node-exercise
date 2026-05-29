import { cacheKeys } from './cache.keys';
import { invalidatePrefix } from './cache.service';

export function invalidateUsers(): void {
  invalidatePrefix(cacheKeys.users.prefix);
}

export function invalidateOrganizations(): void {
  invalidatePrefix(cacheKeys.organizations.prefix);
}

export function invalidateOrders(): void {
  invalidatePrefix(cacheKeys.orders.prefix);
}
