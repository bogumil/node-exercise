import { closeDatabaseConnection, connectDatabase } from './connect-database';
import { OrderModel, OrganizationModel, UserModel } from './models';

const organizations = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    name: 'Acme Logistics',
    industry: 'Logistics',
    dateFounded: '2012-04-10',
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    name: 'Northwind Retail',
    industry: 'Retail',
    dateFounded: '2008-09-15',
  },
];

const users = Array.from({ length: 10 }, (_, index) => {
  const number = index + 1;
  const organizationId = index < 5 ? organizations[0]!.id : organizations[1]!.id;

  return {
    id: `00000000-0000-4000-8000-${String(number).padStart(12, '0')}`,
    organizationId,
    firstName: `User${number}`,
    lastName: index < 5 ? 'Logistics' : 'Retail',
    email: `user${number}@example.com`,
    dateCreated: new Date(`2024-01-${String(number).padStart(2, '0')}T10:00:00.000Z`),
  };
});

const orders = Array.from({ length: 20 }, (_, index) => {
  const number = index + 1;
  const user = users[index % users.length]!;

  return {
    id: `99999999-9999-4999-8999-${String(number).padStart(12, '0')}`,
    userId: user.id,
    organizationId: user.organizationId,
    orderDate: new Date(`2024-02-${String((index % 20) + 1).padStart(2, '0')}T12:00:00.000Z`),
    totalAmount: Number((25 + number * 7.5).toFixed(2)),
  };
});

async function seed() {
  await connectDatabase();

  try {
    await OrganizationModel.bulkCreate(organizations, {
      updateOnDuplicate: ['name', 'industry', 'dateFounded'],
    });

    await UserModel.bulkCreate(users, {
      updateOnDuplicate: ['organizationId', 'firstName', 'lastName', 'email', 'dateCreated'],
    });

    await OrderModel.bulkCreate(orders, {
      updateOnDuplicate: ['userId', 'organizationId', 'orderDate', 'totalAmount'],
    });

    console.log('Seed completed successfully');
    console.log(`Organizations: ${organizations.length}`);
    console.log(`Users: ${users.length}`);
    console.log(`Orders: ${orders.length}`);
  } finally {
    await closeDatabaseConnection();
  }
}

seed().catch(async (error) => {
  console.error('Seed failed', error);

  await closeDatabaseConnection().catch(() => undefined);

  process.exit(1);
});
