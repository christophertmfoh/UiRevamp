import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';
import { insertUserSchema } from '@shared/schema';
import { z } from 'zod';
import SecurityLogger from './utils/securityLogger';

// Secure JWT secret validation
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    SecurityLogger.error('JWT_SECRET is required in production environment');
    throw new Error('JWT_SECRET is required in production');
  }
  SecurityLogger.warn('Using default JWT secret in development - NOT SECURE FOR PRODUCTION');
}
const SALT_ROUNDS = 12;

// Extend Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Enhanced password validation
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

// Validation schemas
export const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores'),
  password: passwordSchema,
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
  const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';

  if (!token) {
    SecurityLogger.logSecurityEvent({
      eventType: 'UNAUTHORIZED_ACCESS',
      severity: 'MEDIUM',
      ipAddress,
      details: {
        endpoint: req.path,
        method: req.method,
        reason: 'Missing access token'
      },
      actionTaken: 'Request blocked'
    });
    return res.status(401).json({ error: 'Access token required' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    SecurityLogger.logSecurityEvent({
      eventType: 'INVALID_TOKEN',
      severity: 'HIGH',
      ipAddress,
      details: {
        endpoint: req.path,
        method: req.method,
        reason: 'Invalid or expired JWT token'
      },
      actionTaken: 'Request blocked'
    });
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
export async function signUp(data: z.infer<typeof signupSchema>, ipAddress: string = 'unknown') {
  // Validate input
  const validatedData = signupSchema.parse(data);

  // Check if user already exists
  const existingUserByEmail = await storage.getUserByEmail(validatedData.email);
  if (existingUserByEmail) {
    SecurityLogger.logSecurityEvent({
      eventType: 'SUSPICIOUS_ACTIVITY',
      severity: 'LOW',
      ipAddress,
      details: {
        action: 'Registration attempt with existing email',
        email: validatedData.email
      },
      actionTaken: 'Registration blocked'
    });
    throw new Error('User with this email already exists');
  }

  const existingUserByUsername = await storage.getUserByUsername(validatedData.username);
  if (existingUserByUsername) {
    SecurityLogger.logSecurityEvent({
      eventType: 'SUSPICIOUS_ACTIVITY',
      severity: 'LOW',
      ipAddress,
      details: {
        action: 'Registration attempt with existing username',
        username: validatedData.username
      },
      actionTaken: 'Registration blocked'
    });
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
export async function signIn(data: z.infer<typeof loginSchema>, ipAddress: string = 'unknown', userAgent: string = 'unknown') {
  // Validate input
  const validatedData = loginSchema.parse(data);

  // Find user by email or username
  const isEmail = validatedData.emailOrUsername.includes('@');
  const user = isEmail 
    ? await storage.getUserByEmail(validatedData.emailOrUsername)
    : await storage.getUserByUsername(validatedData.emailOrUsername);

  if (!user) {
    SecurityLogger.logAuthEvent({
      eventType: 'FAILED_LOGIN',
      ipAddress,
      userAgent,
      metadata: {
        emailOrUsername: validatedData.emailOrUsername,
        reason: 'User not found'
      }
    });
    throw new Error('Invalid credentials');
  }

  if (!user.isActive) {
    SecurityLogger.logAuthEvent({
      eventType: 'FAILED_LOGIN',
      userId: user.id,
      ipAddress,
      userAgent,
      metadata: {
        emailOrUsername: validatedData.emailOrUsername,
        reason: 'Account deactivated'
      }
    });
    throw new Error('Account is deactivated');
  }

  // Verify password
  const isValidPassword = await verifyPassword(validatedData.password, user.passwordHash);
  if (!isValidPassword) {
    SecurityLogger.logAuthEvent({
      eventType: 'FAILED_LOGIN',
      userId: user.id,
      ipAddress,
      userAgent,
      metadata: {
        emailOrUsername: validatedData.emailOrUsername,
        reason: 'Invalid password'
      }
    });
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