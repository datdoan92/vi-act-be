import { Test, TestingModule } from '@nestjs/testing';
import httpMocks from 'node-mocks-http';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;
  let userSrv: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            findOneByIdOrFail: jest.fn().mockResolvedValue({}),
            create: jest.fn().mockResolvedValue({}),
            updateById: jest.fn().mockResolvedValue({}),
            deleteById: jest.fn().mockResolvedValue({}),
            count: jest.fn().mockResolvedValue(0),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userSrv = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const req = httpMocks.createRequest();
      req.res = httpMocks.createResponse();
      const results = [
        {
          id: 1,
          email: 'user@example.com',
          name: 'John Doe',
          age: 30,
        },
      ];
      jest.spyOn(userSrv, 'findAll').mockImplementation(() => results as any);
      jest.spyOn(userSrv, 'count').mockImplementation(async () => 1);
      expect(await userController.findAll(req)).toEqual(results);
      expect(req.res.get('X-Total-Count')).toEqual('1');
    });
  });
});
