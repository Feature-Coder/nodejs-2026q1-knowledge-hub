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
    it('should return empty list initially with pagination wrapper when requested', async () => {
      const response = await request(server).get('/user?page=1&limit=10');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page', 1);
      expect(response.body).toHaveProperty('limit', 10);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(0);
    });

    it('should return 2 records when limiting to 2', async () => {
      // Create 3 users
      for (let i = 0; i < 3; i++) {
        await request(server).post('/user').send({
          login: `User_${i}`,
          password: 'Password123!',
        });
      }

      const response = await request(server).get('/user?page=1&limit=2');
      expect(response.status).toBe(200);
      expect(response.body.total).toBe(3);
      expect(response.body.limit).toBe(2);
      expect(response.body.data.length).toBe(2);
    });
  });

  describe('Sorting', () => {
    it('should sort users by login DESC', async () => {
      const response = await request(server).get('/user?sortBy=login&order=desc');
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      
      const users = response.body;
      expect(users.length).toBe(3);
      expect(users[0].login).toBe('User_2');
      expect(users[2].login).toBe('User_0');
    });

    it('should support sorting and pagination together', async () => {
      const response = await request(server).get('/user?page=1&limit=1&sortBy=login&order=desc');
      expect(response.status).toBe(200);
      expect(response.body.data[0].login).toBe('User_2');
    });
  });
});
