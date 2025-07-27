import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';
import { insertUserSchema } from '@shared/schema';
import { z } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const SALT_ROUNDS = 12;

// Extend Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Validation schemas
export const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(30, 'Username must be less than 30 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().optional()
});

export const loginSchema = z.object({
  emailOrUsername: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required')
});

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Generate JWT token
export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

// Verify JWT token
export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

// Authentication middleware
export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  // Check if session exists and is valid
  const session = await storage.getSessionByToken(token);
  if (!session) {
    return res.status(401).json({ error: 'Session expired' });
  }

  // Get user
  const user = await storage.getUserById(decoded.userId);
  if (!user || !user.isActive) {
    return res.status(401).json({ error: 'User not found or inactive' });
  }

  req.user = user;
  next();
}

// Optional authentication middleware (doesn't fail if no token)
export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      const session = await storage.getSessionByToken(token);
      if (session) {
        const user = await storage.getUserById(decoded.userId);
        if (user && user.isActive) {
          req.user = user;
        }
      }
    }
  }

  next();
}

// Sign up function
export async function signUp(data: z.infer<typeof signupSchema>) {
  // Validate input
  const validatedData = signupSchema.parse(data);

  // Check if user already exists
  const existingUserByEmail = await storage.getUserByEmail(validatedData.email);
  if (existingUserByEmail) {
    throw new Error('User with this email already exists');
  }

  const existingUserByUsername = await storage.getUserByUsername(validatedData.username);
  if (existingUserByUsername) {
    throw new Error('Username already taken');
  }

  // Hash password
  const passwordHash = await hashPassword(validatedData.password);

  // Create user
  const user = await storage.createUser({
    email: validatedData.email,
    username: validatedData.username,
    passwordHash,
    fullName: validatedData.fullName || null,
    isActive: true
  });

  // Generate token and create session
  const token = generateToken(user.id);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await storage.createSession({
    userId: user.id,
    token,
    expiresAt
  });

  // Update last login
  await storage.updateUserLastLogin(user.id);

  return {
    user: { ...user, passwordHash: undefined },
    token
  };
}

// Sign in function
export async function signIn(data: z.infer<typeof loginSchema>) {
  // Validate input
  const validatedData = loginSchema.parse(data);

  // Find user by email or username
  const isEmail = validatedData.emailOrUsername.includes('@');
  const user = isEmail 
    ? await storage.getUserByEmail(validatedData.emailOrUsername)
    : await storage.getUserByUsername(validatedData.emailOrUsername);

  if (!user) {
    throw new Error('Invalid credentials');
  }

  if (!user.isActive) {
    throw new Error('Account is deactivated');
  }

  // Verify password
  const isValidPassword = await verifyPassword(validatedData.password, user.passwordHash);
  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  // Generate token and create session
  const token = generateToken(user.id);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await storage.createSession({
    userId: user.id,
    token,
    expiresAt
  });

  // Update last login
  await storage.updateUserLastLogin(user.id);

  return {
    user: { ...user, passwordHash: undefined },
    token
  };
}

// Sign out function
export async function signOut(token: string) {
  await storage.deleteSession(token);
}