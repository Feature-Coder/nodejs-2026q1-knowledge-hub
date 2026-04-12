import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('Hacker Scope (Pagination & Sorting) (e2e)', () => {
  let app: INestApplication;
  let server: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('User Pagination', () => {
    it('should support pagination wrapper when requested regardless of current DB state', async () => {
      const response = await request(server).get('/user?page=1&limit=10');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page', 1);
      expect(response.body).toHaveProperty('limit', 10);
      expect(response.body.data).toBeInstanceOf(Array);
      // We don't assert length === 0, because seed data might exist
      expect(response.body.data.length).toBeLessThanOrEqual(10);
    });

    it('should return exactly 2 records when limiting to 2', async () => {
      // Create a few users to guarantee we have at least 3
      for (let i = 0; i < 3; i++) {
        await request(server)
          .post('/user')
          .send({
            login: `TestUser_${i}_${Date.now()}`,
            password: 'Password123!',
          });
      }

      const response = await request(server).get('/user?page=1&limit=2');
      expect(response.status).toBe(200);
      expect(response.body.total).toBeGreaterThanOrEqual(3); // Might be 3 + 25 seeded
      expect(response.body.limit).toBe(2);
      expect(response.body.data.length).toBe(2);
    });
  });

  describe('Sorting', () => {
    it('should sort users by login DESC', async () => {
      // Create a specific user with 'zzz' to guarantee it's always the first in DESC sorting
      const uniqueLogin = `zzz_Hacker_${Date.now()}`;
      await request(server).post('/user').send({
        login: uniqueLogin,
        password: 'Password123!',
      });

      const response = await request(server).get(
        '/user?sortBy=login&order=desc',
      );
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);

      const users = response.body;
      expect(users.length).toBeGreaterThanOrEqual(3);

      // If DESC sorting works, 'zzz_' will bubble to the top even above seeded 'user_' logins
      // (lowercase 'z' is mostly sorted last in ASCII, meaning first in DESC)
      expect(users[0].login).toBe(uniqueLogin);
    });

    it('should support sorting and pagination together', async () => {
      const response = await request(server).get(
        '/user?page=1&limit=1&sortBy=login&order=desc',
      );
      expect(response.status).toBe(200);

      // We expect the very first element out of pagination to be our 'zzz_' user
      const login = response.body.data[0].login;
      expect(login.startsWith('zzz_Hacker_')).toBe(true);
    });
  });
});
