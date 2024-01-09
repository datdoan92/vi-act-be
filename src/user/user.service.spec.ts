import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

const oneUser = {
  email: 'user@example.com',
  name: 'John Doe',
  dob: '1990-01-01',
};

describe('UserService', () => {
  let userSrv: UserService;
  let userRepo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn().mockResolvedValue(oneUser),
            save: jest.fn().mockResolvedValue(oneUser),
          },
        },
      ],
    }).compile();

    userSrv = module.get<UserService>(UserService);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userSrv).toBeDefined();
  });

  describe('findOneByIdOrFail()', () => {
    it('should get a single user', () => {
      const repoSpy = jest.spyOn(userRepo, 'findOneBy');
      expect(userSrv.findOneByIdOrFail(1)).resolves.toEqual(oneUser);
      expect(repoSpy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw an error if user not found', () => {
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(undefined);
      expect(userSrv.findOneByIdOrFail(1)).rejects.toThrow('User not found');
    });
  });

  describe('create()', () => {
    it('should successfully insert a user', () => {
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(undefined);
      expect(userSrv.create(oneUser)).resolves.toEqual(oneUser);
    });

    it('should throw an error if user email already exists', () => {
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(oneUser as User);
      expect(userSrv.create(oneUser)).rejects.toThrow(
        'User Email already exists',
      );
    });
  });
});
