import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create predefined categories
  const categories = [
    { name: 'ART' },
    { name: 'SCIENCE' },
    { name: 'TECHNOLOGY' },
    { name: 'CINEMA' },
    { name: 'DESIGN' },
    { name: 'FOOD' },
  ];

  // Insert categories into the database
  for (const category of categories) {
    await prisma.category.create({
      data: category,
    });
  }

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });