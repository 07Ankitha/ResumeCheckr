import { compare, hash } from 'bcryptjs';
import { prisma } from './prisma';

export async function hashPassword(password: string) {
  return await hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return await compare(password, hashedPassword);
}

export async function findUserByEmail(email: string) {
  try {
    return await prisma.user.findUnique({
      where: { email },
    });
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
}

export async function createUser(email: string, password: string, name: string) {
  try {
    const hashedPassword = await hashPassword(password);
    console.log('Creating user with email:', email);
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'user',
      },
    });
    
    console.log('User created successfully:', user.id);
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
} 