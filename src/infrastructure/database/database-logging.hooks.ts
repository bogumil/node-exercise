import type { Model, ModelStatic } from 'sequelize';
import { logger } from '../../config/logger';
import { OrderModel, OrganizationModel, UserModel } from './models';

let registered = false;

function registerModelHooks<M extends Model>(entity: string, model: ModelStatic<M>) {
  model.addHook('afterCreate', `log-${entity}-created`, (instance) => {
    logger.info(
      {
        event: 'database.state_changed',
        entity,
        action: 'created',
        id: instance.get('id'),
      },
      'Database state changed',
    );
  });

  model.addHook('afterUpdate', `log-${entity}-updated`, (instance) => {
    const changed = instance.changed();

    logger.info(
      {
        event: 'database.state_changed',
        entity,
        action: 'updated',
        id: instance.get('id'),
        changedFields: Array.isArray(changed) ? changed : [],
      },
      'Database state changed',
    );
  });

  model.addHook('afterDestroy', `log-${entity}-deleted`, (instance) => {
    logger.info(
      {
        event: 'database.state_changed',
        entity,
        action: 'deleted',
        id: instance.get('id'),
      },
      'Database state changed',
    );
  });

  // todo - add hooks for bulk actions if necessary.
}

export function registerDatabaseLoggingHooks() {
  if (registered) {
    return;
  }

  registerModelHooks('organization', OrganizationModel);
  registerModelHooks('user', UserModel);
  registerModelHooks('order', OrderModel);

  registered = true;
}
