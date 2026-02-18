import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Example: Create a test user
  // const user = await prisma.user.create({
  //   data: {
  //     email: 'test@example.com',
  //     username: 'testuser',
  //     displayName: 'Test User',
  //   },
  // });

  // console.log('✅ Created user:', user.username);

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
