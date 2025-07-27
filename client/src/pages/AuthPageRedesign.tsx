import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Loader2, UserPlus, LogIn, Check, X, Shield, ArrowLeft, Feather } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useMutation } from '@tanstack/react-query';

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
  onAuth: (user: any, token: string) => void;
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
      localStorage.setItem('fablecraft_token', result.token);
      localStorage.setItem('fablecraft_user', JSON.stringify(result.user));
      onAuth(result.user, result.token);
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
      localStorage.setItem('fablecraft_token', result.token);
      localStorage.setItem('fablecraft_user', JSON.stringify(result.user));
      onAuth(result.user, result.token);
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
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-stone-100 to-stone-50 dark:from-stone-900 dark:via-stone-800 dark:to-stone-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient Mesh Background */}
        <div className="absolute inset-0 bg-gradient-to-br" style={{
          background: `linear-gradient(to bottom right, 
            var(--fablecraft-mesh-emerald), 
            var(--fablecraft-mesh-stone), 
            var(--fablecraft-mesh-amber))`
        }}></div>
        
        {/* Floating Orbs */}
        <div 
          className="absolute -top-40 -left-40 w-80 h-80 rounded-full blur-3xl animate-pulse"
          style={{ 
            background: `linear-gradient(to bottom right, var(--fablecraft-orb-emerald), var(--fablecraft-orb-emerald))`,
            transform: `translateY(${scrollY * 0.1}px)` 
          }}
        ></div>
        <div 
          className="absolute top-20 -right-32 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000"
          style={{ 
            background: `linear-gradient(to bottom right, var(--fablecraft-orb-amber), var(--fablecraft-orb-amber))`,
            transform: `translateY(${scrollY * 0.15}px)` 
          }}
        ></div>
        <div 
          className="absolute -bottom-32 left-1/2 w-64 h-64 rounded-full blur-3xl animate-pulse delay-500"
          style={{ 
            background: `linear-gradient(to bottom right, var(--fablecraft-orb-stone), var(--fablecraft-orb-stone))`,
            transform: `translateY(${scrollY * 0.05}px)` 
          }}
        ></div>

        {/* Ambient Lighting Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full blur-2xl animate-pulse delay-300" style={{ background: `var(--fablecraft-ambient-emerald)` }}></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full blur-2xl animate-pulse delay-700" style={{ background: `var(--fablecraft-ambient-amber)` }}></div>
          <div className="absolute top-3/4 left-3/4 w-32 h-32 rounded-full blur-xl animate-pulse delay-1000" style={{ background: `var(--fablecraft-ambient-stone)` }}></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 p-6 lg:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 backdrop-blur-sm border border-black/10 dark:border-white/10 rounded-xl transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          {/* Centered Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-3">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
              <Feather className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-heading-primary drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] tracking-tight">
              Fablecraft
            </h1>
          </div>

        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-black bg-gradient-to-r from-emerald-600 via-stone-800 to-amber-600 dark:from-emerald-400 dark:via-stone-200 dark:to-amber-400 bg-clip-text text-transparent leading-tight tracking-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] mb-4">
              Welcome to Fablecraft
            </h2>
            <p className="text-xl text-body-secondary font-medium leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] tracking-wide">
              Your creative storytelling journey begins here
            </p>
          </div>

          {/* Auth Card */}
          <Card className="bg-white/80 dark:bg-slate-800/40 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-stone-300/30 dark:border-slate-700/20">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="p-6">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/50 dark:bg-slate-700/30 backdrop-blur-sm border border-stone-300/20 dark:border-slate-600/30">
                  <TabsTrigger 
                    value="login" 
                    className="gap-2 data-[state=active]:gradient-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup" 
                    className="gap-2 data-[state=active]:gradient-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
                  >
                    <UserPlus className="w-4 h-4" />
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                {/* Error Display */}
                {error && (
                  <Alert variant="destructive" className="mb-6 bg-red-500/10 border-red-500/30 backdrop-blur-sm">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-200">{error}</AlertDescription>
                  </Alert>
                )}

                {/* Login Tab */}
                <TabsContent value="login" className="space-y-0">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-2xl font-black text-stone-900 dark:text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] tracking-tight">
                      Welcome back
                    </CardTitle>
                    <CardDescription className="text-body-secondary font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] tracking-wide">
                      Sign in to continue your creative journey
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={loginForm.handleSubmit(onLogin)}>
                    <CardContent className="space-y-6 px-0">
                      <div className="space-y-2">
                        <Label htmlFor="emailOrUsername" className="text-stone-800 dark:text-stone-200 font-medium">
                          Email or Username
                        </Label>
                        <Input
                          id="emailOrUsername"
                          type="text"
                          placeholder="Enter your email or username"
                          className="bg-stone-800/10 dark:bg-white/10 border-stone-800/20 dark:border-white/20 text-stone-900 dark:text-white placeholder:text-stone-600 dark:placeholder:text-stone-400 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 backdrop-blur-sm"
                          {...loginForm.register('emailOrUsername')}
                        />
                        {loginForm.formState.errors.emailOrUsername && (
                          <p className="text-sm text-red-400">{loginForm.formState.errors.emailOrUsername.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-stone-800 dark:text-stone-200 font-medium">
                          Password
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          className="bg-stone-800/10 dark:bg-white/10 border-stone-800/20 dark:border-white/20 text-stone-900 dark:text-white placeholder:text-stone-600 dark:placeholder:text-stone-400 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 backdrop-blur-sm"
                          {...loginForm.register('password')}
                        />
                        {loginForm.formState.errors.password && (
                          <p className="text-sm text-red-400">{loginForm.formState.errors.password.message}</p>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="px-0 pb-0">
                      <Button 
                        type="submit" 
                        className="w-full gradient-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:brightness-110 font-semibold tracking-wide"
                        disabled={loginMutation.isPending}
                        size="lg"
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
                    <CardTitle className="text-2xl font-black text-stone-900 dark:text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] tracking-tight">
                      Create account
                    </CardTitle>
                    <CardDescription className="text-stone-700 dark:text-stone-300 font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] tracking-wide">
                      Join our community of creative storytellers
                    </CardDescription>
                  </CardHeader>
                  
                  {/* Security Information */}
                  <div className="mb-6 p-4 bg-emerald-500/10 backdrop-blur-sm rounded-xl border border-emerald-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-200">Account Security</span>
                    </div>
                    <div className="text-xs text-emerald-700/80 dark:text-emerald-300/80 space-y-1 leading-relaxed">
                      <p>• Usernames and emails must be unique</p>
                      <p>• Username: 3-30 characters (letters, numbers, _, -)</p>
                      <p>• Passwords require 8+ characters with mixed case, numbers & symbols</p>
                      <p>• All data is securely encrypted and protected</p>
                    </div>
                  </div>

                  <form onSubmit={signupForm.handleSubmit(onSignup)}>
                    <CardContent className="space-y-6 px-0">
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-stone-800 dark:text-stone-200 font-medium">
                          Full Name <span className="text-stone-600 dark:text-stone-400">(Optional)</span>
                        </Label>
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="Enter your full name"
                          className="bg-stone-800/10 dark:bg-white/10 border-stone-800/20 dark:border-white/20 text-stone-900 dark:text-white placeholder:text-stone-600 dark:placeholder:text-stone-400 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 backdrop-blur-sm"
                          {...signupForm.register('fullName')}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-stone-800 dark:text-stone-200 font-medium">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          className="bg-stone-800/10 dark:bg-white/10 border-stone-800/20 dark:border-white/20 text-stone-900 dark:text-white placeholder:text-stone-600 dark:placeholder:text-stone-400 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 backdrop-blur-sm"
                          {...signupForm.register('email')}
                        />
                        {signupForm.formState.errors.email && (
                          <p className="text-sm text-red-400">{signupForm.formState.errors.email.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username" className="text-stone-800 dark:text-stone-200 font-medium">Username</Label>
                        <Input
                          id="username"
                          type="text"
                          placeholder="Choose a username"
                          className="bg-stone-800/10 dark:bg-white/10 border-stone-800/20 dark:border-white/20 text-stone-900 dark:text-white placeholder:text-stone-600 dark:placeholder:text-stone-400 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 backdrop-blur-sm"
                          {...signupForm.register('username')}
                        />
                        {signupForm.formState.errors.username && (
                          <p className="text-sm text-red-400">{signupForm.formState.errors.username.message}</p>
                        )}
                        <p className="text-xs text-stone-600 dark:text-stone-400">3-30 characters, letters/numbers/hyphens/underscores only</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-stone-800 dark:text-stone-200 font-medium">Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder="Create a password"
                          className="bg-stone-800/10 dark:bg-white/10 border-stone-800/20 dark:border-white/20 text-stone-900 dark:text-white placeholder:text-stone-600 dark:placeholder:text-stone-400 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 backdrop-blur-sm"
                          {...signupForm.register('password', {
                            onChange: (e) => {
                              setPasswordStrength(checkPasswordStrength(e.target.value));
                            }
                          })}
                        />
                        {signupForm.formState.errors.password && (
                          <p className="text-sm text-red-400">{signupForm.formState.errors.password.message}</p>
                        )}
                        
                        {/* Password Strength Indicator */}
                        {signupForm.watch('password') && (
                          <div className="mt-3 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-stone-700 dark:text-stone-300 font-medium">Password Strength:</span>
                              <span className={`text-xs font-semibold ${passwordStrength.color}`}>
                                {passwordStrength.strength}
                              </span>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="w-full bg-stone-300/50 dark:bg-stone-700/50 rounded-full h-2 backdrop-blur-sm">
                              <div 
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  passwordStrength.score >= 5 ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' :
                                  passwordStrength.score >= 3 ? 'bg-gradient-to-r from-amber-500 to-amber-600' : 
                                  'bg-gradient-to-r from-red-500 to-red-600'
                                }`}
                                style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                              />
                            </div>
                            
                            {/* Requirements Checklist */}
                            <div className="grid grid-cols-1 gap-1.5 text-xs">
                              <div className={`flex items-center gap-2 ${passwordStrength.checks.length ? 'text-emerald-400' : 'text-stone-500 dark:text-stone-500'}`}>
                                {passwordStrength.checks.length ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                8+ characters
                              </div>
                              <div className={`flex items-center gap-2 ${passwordStrength.checks.uppercase ? 'text-emerald-400' : 'text-stone-500 dark:text-stone-500'}`}>
                                {passwordStrength.checks.uppercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                Uppercase letter
                              </div>
                              <div className={`flex items-center gap-2 ${passwordStrength.checks.lowercase ? 'text-emerald-400' : 'text-stone-500 dark:text-stone-500'}`}>
                                {passwordStrength.checks.lowercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                Lowercase letter
                              </div>
                              <div className={`flex items-center gap-2 ${passwordStrength.checks.number ? 'text-emerald-400' : 'text-stone-500 dark:text-stone-500'}`}>
                                {passwordStrength.checks.number ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                Number
                              </div>
                              <div className={`flex items-center gap-2 ${passwordStrength.checks.special ? 'text-emerald-400' : 'text-stone-500 dark:text-stone-500'}`}>
                                {passwordStrength.checks.special ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                Special character
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="px-0 pb-0">
                      <Button 
                        type="submit" 
                        className="w-full gradient-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:brightness-110 font-semibold tracking-wide"
                        disabled={signupMutation.isPending}
                        size="lg"
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
        </div>
      </div>
    </div>
  );
}