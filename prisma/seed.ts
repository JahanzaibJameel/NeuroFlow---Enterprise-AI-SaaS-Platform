import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Hash password for demo users
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  // Create admin user (password: admin123)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@neuroflow.dev' },
    update: {},
    create: {
      email: 'admin@neuroflow.dev',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // Create demo user (password: admin123)
  const demoUser = await prisma.user.upsert({
    where: { email: 'user@neuroflow.dev' },
    update: {},
    create: {
      email: 'user@neuroflow.dev',
      name: 'Demo User',
      password: hashedPassword,
      role: 'USER',
    },
  });

  // Create sample projects
  await prisma.project.createMany({
    data: [
      {
        name: 'AI Marketing Dashboard',
        description: 'Generative UI dashboard for marketing analytics',
        userId: demoUser.id,
      },
      {
        name: 'E-commerce Platform',
        description: 'Full-stack e-commerce with AI recommendations',
        userId: demoUser.id,
      },
    ],
  });

  // Create sample notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: demoUser.id,
        title: 'Welcome to NeuroFlow!',
        content: 'Get started by exploring the AI Playground.',
        read: false,
      },
      {
        userId: demoUser.id,
        title: 'New Feature Available',
        content: 'Generative UI is now in beta. Try it out!',
        read: false,
      },
    ],
  });
}

main()
  .catch((e) => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
