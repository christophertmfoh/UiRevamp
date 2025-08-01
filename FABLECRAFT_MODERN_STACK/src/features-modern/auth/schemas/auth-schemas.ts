import { z } from 'zod';

/**
 * Internationalized error helper
 * To keep this module framework-agnostic we accept a translate function `t`.
 * If you don’t need i18n just pass `(s) => s`.
 */
export const createAuthSchemas = (t: (key: string) => string = (s) => s) => {
  const commonPassword = z
    .string()
    .min(8, t('passwordMinLength'))
    .regex(/[A-Z]/, t('passwordUppercase'))
    .regex(/[a-z]/, t('passwordLowercase'))
    .regex(/[0-9]/, t('passwordNumber'));

  return {
    login: z.object({
      email: z
        .string()
        .min(1, t('emailRequired'))
        .email(t('invalidEmail')),
      password: z.string().min(1, t('passwordRequired')).min(8, t('passwordMinLength')),
      rememberMe: z.boolean().optional(),
    }),

    signup: z
      .object({
        name: z.string().min(2, t('nameRequired')).max(50, t('nameTooLong')),
        email: z.string().min(1, t('emailRequired')).email(t('invalidEmail')),
        password: commonPassword,
        confirmPassword: z.string(),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: t('passwordsDoNotMatch'),
        path: ['confirmPassword'],
      }),
  } as const;
};

export type LoginSchema = ReturnType<typeof createAuthSchemas>['login'];
export type SignupSchema = ReturnType<typeof createAuthSchemas>['signup'];