import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Loader2, UserPlus, LogIn, Check, X, Shield, ArrowLeft, Feather, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useMutation } from '@tanstack/react-query';
import { ThemeToggle } from '@/components/theme-toggle';
import { motion } from 'framer-motion';

// Enhanced password validation
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

// Validation schemas
const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores'),
  password: passwordSchema,
  fullName: z.string().optional()
});

const loginSchema = z.object({
  emailOrUsername: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required')
});

type SignupData = z.infer<typeof signupSchema>;
type LoginData = z.infer<typeof loginSchema>;

interface AuthPageProps {
  onAuth: (userData: { username: string; token: string }) => void;
  onBack: () => void;
}

// Password strength checker
function checkPasswordStrength(password: string) {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  };
  
  const score = Object.values(checks).filter(Boolean).length;
  let strength = 'Weak';
  let color = 'text-red-500';
  
  if (score >= 5) {
    strength = 'Strong';
    color = 'icon-primary';
  } else if (score >= 3) {
    strength = 'Medium';
    color = 'icon-secondary';
  }
  
  return { checks, score, strength, color };
}

export function AuthPageRedesign({ onAuth, onBack }: AuthPageProps) {
  const [activeTab, setActiveTab] = useState('login');
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(checkPasswordStrength(''));
  const [scrollY, setScrollY] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Parallax scrolling effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const signupForm = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      fullName: ''
    }
  });

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrUsername: '',
      password: ''
    }
  });

  const signupMutation = useMutation({
    mutationFn: async (data: SignupData) => {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Signup failed');
      }
      
      return await response.json();
    },
    onSuccess: (result) => {
      // Store token with consistent key name for App.tsx
      localStorage.setItem('token', result.token);
      localStorage.setItem('fablecraft_token', result.token);
      localStorage.setItem('fablecraft_user', JSON.stringify(result.user));
      onAuth({ username: result.user.username, token: result.token });
    },
    onError: (error: any) => {
      setError(error.message || 'Signup failed');
    }
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }
      
      return await response.json();
    },
    onSuccess: (result) => {
      // Store token with consistent key name for App.tsx
      localStorage.setItem('token', result.token);
      localStorage.setItem('fablecraft_token', result.token);
      localStorage.setItem('fablecraft_user', JSON.stringify(result.user));
      onAuth({ username: result.user.username, token: result.token });
    },
    onError: (error: any) => {
      setError(error.message || 'Login failed');
    }
  });

  const onSignup = (data: SignupData) => {
    setError('');
    signupMutation.mutate(data);
  };

  const onLogin = (data: LoginData) => {
    setError('');
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: `hsl(var(--background))` }}>
      {/* Left Side: Branding & Creative Quote */}
      <motion.div 
        className="hidden lg:flex lg:flex-1 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, hsl(var(--auth-panel-gradient-from)), hsl(var(--auth-panel-gradient-via)), hsl(var(--auth-panel-gradient-to)))`,
          color: `hsl(var(--auth-panel-text))`
        }}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Floating Orbs */}
          <div 
            className="absolute -top-40 -left-40 w-80 h-80 rounded-full blur-3xl animate-pulse"
            style={{ 
              background: `radial-gradient(circle, hsla(var(--orb-primary), 0.4), hsla(var(--orb-primary), 0.2))`,
              transform: `translateY(${scrollY * 0.1}px)` 
            }}
          ></div>
          <div 
            className="absolute top-20 -right-32 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000"
            style={{ 
              background: `radial-gradient(circle, hsla(var(--orb-secondary), 0.3), hsla(var(--orb-secondary), 0.1))`,
              transform: `translateY(${scrollY * 0.15}px)` 
            }}
          ></div>
          <div 
            className="absolute -bottom-32 left-1/2 w-64 h-64 rounded-full blur-3xl animate-pulse delay-500"
            style={{ 
              background: `radial-gradient(circle, hsla(var(--muted), 0.3), hsla(var(--muted), 0.1))`,
              transform: `translateY(${scrollY * 0.05}px)` 
            }}
          ></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 py-16">
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-8">
              <div 
                className="w-12 h-12 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: `hsla(var(--auth-panel-text), 0.2)` }}
              >
                <Feather className="w-6 h-6" style={{ color: `hsl(var(--auth-panel-text))` }} />
              </div>
              <h1 className="text-3xl font-serif font-bold tracking-tight" style={{ color: `hsl(var(--auth-panel-text))` }}>
                FableCraft
              </h1>
            </div>
            
            <h2 className="text-4xl font-bold mb-6 leading-tight" style={{ color: `hsl(var(--auth-panel-text))` }}>
              Where stories come to life
            </h2>
            
            <p className="text-xl mb-8 leading-relaxed" style={{ color: `hsla(var(--auth-panel-text), 0.9)` }}>
              Join thousands of creative writers using AI-powered tools to craft compelling characters, build immersive worlds, and tell unforgettable stories.
            </p>

            {/* Creative Quote */}
            <div 
              className="backdrop-blur-sm rounded-2xl p-6 border"
              style={{ 
                backgroundColor: `hsla(var(--auth-panel-text), 0.1)`,
                borderColor: `hsla(var(--auth-panel-text), 0.2)`
              }}
            >
              <blockquote className="text-lg italic leading-relaxed mb-4" style={{ color: `hsla(var(--auth-panel-text), 0.9)` }}>
                "Every great story begins with a single character who refuses to be forgotten."
              </blockquote>
              <cite className="text-sm font-medium" style={{ color: `hsla(var(--auth-panel-text), 0.8)` }}>
                — Maya Chen, Award-winning Novelist
              </cite>
            </div>

            {/* Features Preview */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3" style={{ color: `hsla(var(--auth-panel-text), 0.8)` }}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: `hsl(var(--auth-brand-primary))` }}></div>
                <span className="text-sm">164+ character fields with AI assistance</span>
              </div>
              <div className="flex items-center gap-3" style={{ color: `hsla(var(--auth-panel-text), 0.8)` }}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: `hsl(var(--auth-brand-primary))` }}></div>
                <span className="text-sm">World building tools and relationship mapping</span>
              </div>
              <div className="flex items-center gap-3" style={{ color: `hsla(var(--auth-panel-text), 0.8)` }}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: `hsl(var(--auth-brand-primary))` }}></div>
                <span className="text-sm">Real-time collaboration and project management</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Side: Authentication Form */}
      <motion.div 
        className="flex-1 flex flex-col justify-center px-4 py-12 lg:px-12 lg:py-16 relative"
        style={{ backgroundColor: `hsl(var(--auth-form-bg))` }}
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
        {/* Mobile Navigation */}
        <nav 
          className="lg:hidden absolute top-0 left-0 right-0 p-4 flex justify-between items-center backdrop-blur-sm border-b"
          style={{ 
            backgroundColor: `hsla(var(--auth-form-bg), 0.8)`,
            borderColor: `hsl(var(--auth-input-border))`
          }}>
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            style={{ 
              color: `hsl(var(--foreground))`,
              '--hover-bg': `hsl(var(--muted))`
            } as React.CSSProperties}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.backgroundColor = `hsl(var(--muted))`;
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.backgroundColor = 'transparent';
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Feather className="w-5 h-5" style={{ color: `hsl(var(--auth-brand-primary))` }} />
            <span className="font-serif font-bold" style={{ color: `hsl(var(--foreground))` }}>FableCraft</span>
          </div>
          <ThemeToggle />
        </nav>

        {/* Desktop Navigation */}
        <nav className="hidden lg:block absolute top-0 right-0 p-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              style={{ 
                color: `hsl(var(--muted-foreground))`,
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = `hsl(var(--foreground))`;
                (e.target as HTMLElement).style.backgroundColor = `hsl(var(--muted))`;
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = `hsl(var(--muted-foreground))`;
                (e.target as HTMLElement).style.backgroundColor = 'transparent';
              }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <ThemeToggle />
          </div>
        </nav>

        {/* Main Content */}
        <div className="w-full max-w-md mx-auto mt-16 lg:mt-0">
          {/* Mobile Branding */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: `hsl(var(--auth-brand-primary))` }}
              >
                <Feather className="w-5 h-5" style={{ color: `hsl(var(--auth-panel-text))` }} />
              </div>
              <h1 className="text-2xl font-serif font-bold" style={{ color: `hsl(var(--foreground))` }}>
                FableCraft
              </h1>
            </div>
            <p style={{ color: `hsl(var(--muted-foreground))` }}>
              Your creative storytelling platform
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Auth Card */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          >
            <Card 
              className="shadow-xl"
              style={{ 
                backgroundColor: `hsl(var(--auth-card-bg))`,
                borderColor: `hsl(var(--auth-input-border))`
              }}>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="p-6">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger 
                    value="login" 
                    className="gap-2"
                    style={{
                      '--active-bg': `hsl(var(--auth-button-primary))`,
                      '--active-text': `hsl(var(--auth-panel-text))`
                    } as React.CSSProperties}
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup" 
                    className="gap-2"
                    style={{
                      '--active-bg': `hsl(var(--auth-button-primary))`,
                      '--active-text': `hsl(var(--auth-panel-text))`
                    } as React.CSSProperties}
                  >
                    <UserPlus className="w-4 h-4" />
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                {/* Login Tab */}
                <TabsContent value="login" className="space-y-0">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-2xl font-bold" style={{ color: `hsl(var(--foreground))` }}>
                      Welcome back
                    </CardTitle>
                    <CardDescription style={{ color: `hsl(var(--muted-foreground))` }}>
                      Sign in to continue your creative journey
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={loginForm.handleSubmit(onLogin)}>
                    <CardContent className="space-y-6 px-0">
                      <div className="space-y-2">
                        <Label htmlFor="emailOrUsername" className="text-sm font-medium" style={{ color: `hsl(var(--foreground))` }}>
                          Email or Username
                        </Label>
                        <Input
                          id="emailOrUsername"
                          type="text"
                          placeholder="Enter your email or username"
                          className="h-11"
                          style={{
                            borderColor: `hsl(var(--auth-input-border))`,
                            backgroundColor: `hsl(var(--input))`,
                            color: `hsl(var(--foreground))`
                          }}
                          {...loginForm.register('emailOrUsername')}
                        />
                        {loginForm.formState.errors.emailOrUsername && (
                          <p className="text-sm text-red-500">{loginForm.formState.errors.emailOrUsername.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium" style={{ color: `hsl(var(--foreground))` }}>
                          Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="h-11 pr-10"
                            style={{
                              borderColor: `hsl(var(--auth-input-border))`,
                              backgroundColor: `hsl(var(--input))`,
                              color: `hsl(var(--foreground))`
                            }}
                            {...loginForm.register('password')}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" style={{ color: `hsl(var(--muted-foreground))` }} />
                            ) : (
                              <Eye className="w-4 h-4" style={{ color: `hsl(var(--muted-foreground))` }} />
                            )}
                          </Button>
                        </div>
                        {loginForm.formState.errors.password && (
                          <p className="text-sm text-red-500">{loginForm.formState.errors.password.message}</p>
                        )}
                      </div>

                      {/* Social Auth Buttons (Visual Only) */}
                      <div className="space-y-3">
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" style={{ borderColor: `hsl(var(--auth-input-border))` }} />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="px-2" style={{ 
                              backgroundColor: `hsl(var(--auth-form-bg))`,
                              color: `hsl(var(--muted-foreground))`
                            }}>Or continue with</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            disabled
                            className="h-11"
                            style={{
                              borderColor: `hsl(var(--auth-input-border))`,
                              color: `hsl(var(--muted-foreground))`
                            }}
                          >
                            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Google
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            disabled
                            className="h-11"
                            style={{
                              borderColor: `hsl(var(--auth-input-border))`,
                              color: `hsl(var(--muted-foreground))`
                            }}
                          >
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            GitHub
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="px-0 pb-0">
                      <Button 
                        type="submit" 
                        className="w-full h-11 font-medium"
                        style={{
                          backgroundColor: `hsl(var(--auth-button-primary))`,
                          color: `hsl(var(--auth-panel-text))`
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.backgroundColor = `hsl(var(--auth-button-primary-hover))`;
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.backgroundColor = `hsl(var(--auth-button-primary))`;
                        }}
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          'Sign In'
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </TabsContent>

                {/* Signup Tab */}
                <TabsContent value="signup" className="space-y-0">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-2xl font-bold" style={{ color: `hsl(var(--foreground))` }}>
                      Create account
                    </CardTitle>
                    <CardDescription style={{ color: `hsl(var(--muted-foreground))` }}>
                      Join our community of creative storytellers
                    </CardDescription>
                  </CardHeader>

                  <form onSubmit={signupForm.handleSubmit(onSignup)}>
                    <CardContent className="space-y-6 px-0">
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-sm font-medium" style={{ color: `hsl(var(--foreground))` }}>
                          Full Name <span style={{ color: `hsl(var(--muted-foreground))` }}>(Optional)</span>
                        </Label>
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="Enter your full name"
                          className="h-11"
                          style={{
                            borderColor: `hsl(var(--auth-input-border))`,
                            backgroundColor: `hsl(var(--input))`,
                            color: `hsl(var(--foreground))`
                          }}
                          {...signupForm.register('fullName')}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium" style={{ color: `hsl(var(--foreground))` }}>Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          className="h-11"
                          style={{
                            borderColor: `hsl(var(--auth-input-border))`,
                            backgroundColor: `hsl(var(--input))`,
                            color: `hsl(var(--foreground))`
                          }}
                          {...signupForm.register('email')}
                        />
                        {signupForm.formState.errors.email && (
                          <p className="text-sm text-red-500">{signupForm.formState.errors.email.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username" className="text-sm font-medium" style={{ color: `hsl(var(--foreground))` }}>Username</Label>
                        <Input
                          id="username"
                          type="text"
                          placeholder="Choose a username"
                          className="h-11"
                          style={{
                            borderColor: `hsl(var(--auth-input-border))`,
                            backgroundColor: `hsl(var(--input))`,
                            color: `hsl(var(--foreground))`
                          }}
                          {...signupForm.register('username')}
                        />
                        {signupForm.formState.errors.username && (
                          <p className="text-sm text-red-500">{signupForm.formState.errors.username.message}</p>
                        )}
                        <p className="text-xs" style={{ color: `hsl(var(--muted-foreground))` }}>3-30 characters, letters/numbers/hyphens/underscores only</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-sm font-medium" style={{ color: `hsl(var(--foreground))` }}>Password</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Create a password"
                            className="h-11 pr-10"
                            style={{
                              borderColor: `hsl(var(--auth-input-border))`,
                              backgroundColor: `hsl(var(--input))`,
                              color: `hsl(var(--foreground))`
                            }}
                            {...signupForm.register('password', {
                              onChange: (e) => {
                                setPasswordStrength(checkPasswordStrength(e.target.value));
                              }
                            })}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <EyeOff className="w-4 h-4" style={{ color: `hsl(var(--muted-foreground))` }} />
                            ) : (
                              <Eye className="w-4 h-4" style={{ color: `hsl(var(--muted-foreground))` }} />
                            )}
                          </Button>
                        </div>
                        {signupForm.formState.errors.password && (
                          <p className="text-sm text-red-500">{signupForm.formState.errors.password.message}</p>
                        )}
                        
                        {/* Password Strength Indicator */}
                        {signupForm.watch('password') && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ duration: 0.3 }}
                            className="mt-3 space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium" style={{ color: `hsl(var(--muted-foreground))` }}>Password Strength:</span>
                              <span className={`text-xs font-semibold ${
                                passwordStrength.score >= 5 ? 'text-emerald-600' :
                                passwordStrength.score >= 3 ? 'text-yellow-600' : 
                                'text-red-600'
                              }`}>
                                {passwordStrength.strength}
                              </span>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="w-full rounded-full h-2" style={{ backgroundColor: `hsl(var(--muted))` }}>
                              <motion.div 
                                className={`h-2 rounded-full transition-colors duration-300 ${
                                  passwordStrength.score >= 5 ? 'bg-emerald-500' :
                                  passwordStrength.score >= 3 ? 'bg-yellow-500' : 
                                  'bg-red-500'
                                }`}
                                initial={{ width: 0 }}
                                animate={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                            
                            {/* Requirements Checklist */}
                            <div className="grid grid-cols-1 gap-1.5 text-xs">
                              {[
                                { key: 'length', label: '8+ characters' },
                                { key: 'uppercase', label: 'Uppercase letter' },
                                { key: 'lowercase', label: 'Lowercase letter' },
                                { key: 'number', label: 'Number' },
                                { key: 'special', label: 'Special character' }
                              ].map(({ key, label }) => (
                                <motion.div 
                                  key={key}
                                  className={`flex items-center gap-2 ${
                                    passwordStrength.checks[key as keyof typeof passwordStrength.checks] 
                                      ? 'text-emerald-600' 
                                      : 'text-stone-400 dark:text-stone-500'
                                  }`}
                                  initial={{ x: -10, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ delay: 0.1 }}
                                >
                                  {passwordStrength.checks[key as keyof typeof passwordStrength.checks] ? (
                                    <Check className="w-3 h-3" />
                                  ) : (
                                    <X className="w-3 h-3" />
                                  )}
                                  {label}
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="px-0 pb-0">
                      <Button 
                        type="submit" 
                        className="w-full h-11 font-medium"
                        style={{
                          backgroundColor: `hsl(var(--auth-button-primary))`,
                          color: `hsl(var(--auth-panel-text))`
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.backgroundColor = `hsl(var(--auth-button-primary-hover))`;
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.backgroundColor = `hsl(var(--auth-button-primary))`;
                        }}
                        disabled={signupMutation.isPending}
                      >
                        {signupMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          'Create Account'
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </TabsContent>
              </div>
            </Tabs>
          </Card>
        </motion.div>
        </div>
      </motion.div>
    </div>
  );
}