import { PrismaClient, UserRole, ArticleStatus } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { databaseUrl } from '../prisma.config';

const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// --- CONFIGURATION ---
const USERS_COUNT = Number(process.env.SEED_USERS_COUNT) || 25;
const ARTICLES_COUNT = Number(process.env.SEED_ARTICLES_COUNT) || 50;
const COMMENTS_COUNT = Number(process.env.SEED_COMMENTS_COUNT) || 100;

// --- MOCK DICTIONARIES ---
const CATEGORIES = [
  { name: 'Technology', description: 'Latest trends in tech and gadgets.' },
  {
    name: 'Design',
    description: 'UI/UX, graphic design, and web design principles.',
  },
  {
    name: 'Development',
    description: 'Software engineering, architecture, and coding.',
  },
  {
    name: 'DevOps',
    description: 'Infrastructure, CI/CD pipelines, and cloud computing.',
  },
  {
    name: 'Marketing',
    description: 'Digital marketing, SEO, and growth strategies.',
  },
  { name: 'Business', description: 'Startups, team management, and finance.' },
];

const TAGS = [
  'React',
  'Next.js',
  'PostgreSQL',
  'Docker',
  'UI/UX',
  'Cloud',
  'Security',
  'API',
  'TypeScript',
  'Node.js',
];

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

const COMMENT_TEMPLATES = [
  'Great read, thanks for sharing!',
  'I completely disagree with this point.',
  'Very helpful tutorial, saved me a lot of time.',
  'Can you explain the second paragraph in more detail?',
  'Awesome content as always!',
  'This is exactly what I was looking for.',
  'Interesting perspective, never thought about it this way.',
  'Could you provide more examples?',
  'I encountered an error trying to implement this. Any tips?',
  LOREM.substring(0, 80),
];

// --- HELPERS ---
const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const randomItem = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];
const randomElements = <T>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const getRandomRole = (): UserRole => {
  const rand = Math.random();
  if (rand < 0.1) return UserRole.ADMIN;
  if (rand < 0.3) return UserRole.EDITOR;
  return UserRole.VIEWER;
};

const getRandomStatus = (): ArticleStatus => {
  const rand = Math.random();
  if (rand < 0.7) return ArticleStatus.PUBLISHED;
  if (rand < 0.9) return ArticleStatus.DRAFT;
  return ArticleStatus.ARCHIVED;
};

async function main() {
  console.log('🧹 Cleaning up database...');
  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('🌱 Starting seed generation...');

  // 1. Categories
  console.log(`Creating ${CATEGORIES.length} categories...`);
  const createdCategories = await Promise.all(
    CATEGORIES.map((cat) =>
      prisma.category.create({
        data: { name: cat.name, description: cat.description },
      }),
    ),
  );

  // 2. Tags
  console.log(`Creating ${TAGS.length} tags...`);
  const createdTags = await Promise.all(
    TAGS.map((name) => prisma.tag.create({ data: { name } })),
  );

  // 3. Users
  console.log(`Creating ${USERS_COUNT} users...`);
  const createdUsers = await Promise.all(
    Array.from({ length: USERS_COUNT }).map((_, i) =>
      prisma.user.create({
        data: {
          login: `user_${i + 1}_${Math.random().toString(36).substring(7)}`,
          password: 'hashed_password_mock',
          role: getRandomRole(),
        },
      }),
    ),
  );

  const authors = createdUsers.filter(
    (u) => u.role === UserRole.ADMIN || u.role === UserRole.EDITOR,
  );
  const safeAuthors = authors.length > 0 ? authors : [createdUsers[0]];

  // 4. Articles
  console.log(`Creating ${ARTICLES_COUNT} articles...`);
  const createdArticles = await Promise.all(
    Array.from({ length: ARTICLES_COUNT }).map((_, i) => {
      const articleTags = randomElements(createdTags, randomInt(1, 3));

      return prisma.article.create({
        data: {
          title: `Understanding ${randomItem(TAGS)}: Best Practices and Tips #${i + 1}`,
          content: `${LOREM}\n\n${LOREM}`,
          status: getRandomStatus(),
          authorId: randomItem(safeAuthors).id,
          categoryId: randomItem(createdCategories).id,
          tags: {
            connect: articleTags.map((tag) => ({ id: tag.id })),
          },
        },
      });
    }),
  );

  // 5. Comments
  console.log(`Creating ${COMMENTS_COUNT} comments...`);
  await Promise.all(
    Array.from({ length: COMMENTS_COUNT }).map(() =>
      prisma.comment.create({
        data: {
          content: randomItem(COMMENT_TEMPLATES),
          authorId: randomItem(createdUsers).id,
          articleId: randomItem(createdArticles).id,
        },
      }),
    ),
  );

  console.log('✅ Database successfully seeded with mock data!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
