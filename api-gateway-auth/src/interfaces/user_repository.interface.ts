import { User, Prisma } from '@prisma/client';

export interface IUserRepository {
  createUser(data: Prisma.UserCreateInput): Promise<User>;
  getUserById(user_id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
  updateUser(user_id: string, data: Prisma.UserUpdateInput): Promise<User>;
  deleteUser(user_id: string): Promise<User>;
}
