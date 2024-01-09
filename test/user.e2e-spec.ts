import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import request from 'supertest';

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let userRepo: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [User],
          synchronize: true,
        }),
      ],
    }).compile();

    userRepo = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/users (POST)', () => {
    it('should throw an error if input is invalid', async () => {
      const user = {
        email: 'invalid-email',
        name: 'John Doe',
        dob: 'invalid-dob',
      };
      const res = await request(app.getHttpServer())
        .post('/users')
        .send(user)
        .expect(400);

      expect(res.body.message).toEqual([
        'email must be an email',
        'dob must be a valid ISO 8601 date string',
      ]);
    });

    it('should create a user', async () => {
      const user = {
        email: 'user@example.com',
        name: 'John Doe',
        dob: '1990-01-01',
      };
      const res = await request(app.getHttpServer())
        .post('/users')
        .send(user)
        .expect(201);

      expect(typeof res.body.id).toBe('number');
      expect(res.body.email).toEqual(user.email);
      expect(res.body.name).toEqual(user.name);
      expect(res.body.dob).toEqual(user.dob);
    });

    it('should throw an error if email already exists', async () => {
      const user = {
        email: 'user@example.com',
        name: 'John Doe',
        dob: '1990-01-01',
      };
      const res = await request(app.getHttpServer())
        .post('/users')
        .send(user)
        .expect(400);

      expect(res.body.message).toEqual('User Email already exists');
    });
  });

  describe('/users/:id (GET)', () => {
    it('should throw an error if user not found', async () => {
      // delete all users
      await userRepo.clear();
      const res = await request(app.getHttpServer())
        .get('/users/999')
        .expect(404);

      expect(res.body.message).toEqual('User not found');
    });

    it('should get a single user', async () => {
      // delete all users
      await userRepo.clear();
      // create a user
      const user = {
        id: 1,
        email: 'user@example.com',
        name: 'John Doe',
        dob: '1990-01-01',
      };

      await userRepo.save(user);

      const res = await request(app.getHttpServer())
        .get('/users/1')
        .expect(200);

      expect(res.body.id).toEqual(user.id);
      expect(res.body.email).toEqual(user.email);
      expect(res.body.name).toEqual(user.name);
    });
  });
});
