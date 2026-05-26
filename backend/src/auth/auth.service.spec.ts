import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { User } from '../database/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  const repo = {
    findOne: jest.fn(), find: jest.fn(), save: jest.fn(),
    create: jest.fn((x) => x),
    createQueryBuilder: jest.fn(() => ({
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(null),
    })),
  };
  beforeEach(async () => {
    const mod = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: repo },
        { provide: JwtService, useValue: { signAsync: jest.fn().mockResolvedValue('token') } },
        { provide: ConfigService, useValue: { get: jest.fn().mockReturnValue('secret') } },
      ],
    }).compile();
    service = mod.get(AuthService);
  });
  it('rejects login when user not found', async () => {
    await expect(service.login({ email: 'x@x.com', password: '12345678' }))
      .rejects.toThrow('Invalid credentials');
  });
  it('registers a new user when not taken', async () => {
    repo.findOne.mockResolvedValueOnce(null);
    repo.save.mockResolvedValueOnce({ id: '1', email: 'a@b.com', username: 'a', full_name: 'A', role: 'student' });
    const out = await service.register({ email: 'a@b.com', username: 'aaa', full_name: 'A', password: 'password123' });
    expect(out.access_token).toBe('token');
  });
});
