import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Code2, ShieldCheck, UserPlus, LogIn, Eye, EyeOff } from 'lucide-react';
import { isAdminUser } from '../utils/userProgress';
import * as api from '../utils/api';

export function AuthPage({ onLogin }) {
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    if (!loginIdentifier.trim()) {
      setLoginError('Username is required');
      setIsLoading(false);
      return;
    }

    if (!loginPassword.trim()) {
      setLoginError('Password is required');
      setIsLoading(false);
      return;
    }

    try {
      const result = await api.loginUser(loginIdentifier, loginPassword);
      if (result.success && result.user) {
        onLogin({
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          email: result.user.email,
          username: result.user.username,
          password: result.user.password,
        });
      } else {
        setLoginError(result.error || 'Invalid username or password');
      }
    } catch (error) {
      setLoginError('Login failed. Please try again.');
    }

    setIsLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError('');
    setIsLoading(true);

    if (!firstName.trim()) { setRegisterError('First name is required'); setIsLoading(false); return; }
    if (!lastName.trim()) { setRegisterError('Last name is required'); setIsLoading(false); return; }
    if (!email.trim()) { setRegisterError('Email is required'); setIsLoading(false); return; }
    if (!validateEmail(email)) { setRegisterError('Please enter a valid email address'); setIsLoading(false); return; }
    if (!username.trim()) { setRegisterError('Username is required'); setIsLoading(false); return; }
    if (username.length < 3) { setRegisterError('Username must be at least 3 characters'); setIsLoading(false); return; }
    if (!password.trim()) { setRegisterError('Password is required'); setIsLoading(false); return; }
    if (password.length < 6) { setRegisterError('Password must be at least 6 characters'); setIsLoading(false); return; }
    if (password !== confirmPassword) { setRegisterError('Passwords do not match'); setIsLoading(false); return; }

    try {
      const emailExists = await api.checkEmailExists(email);
      if (emailExists) {
        setRegisterError('This email is already registered. Please login or use a different email.');
        setIsLoading(false);
        return;
      }

      const userData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        username: username.trim(),
        password,
        totalQuizzesTaken: 0,
        bestScore: 0,
        totalQuestionsAnswered: 0,
        correctAnswers: 0,
        attempts: [],
        isAdmin: isAdminUser(email),
      };

      const result = await api.registerUser(userData);
      if (result.success) {
        onLogin({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          username: userData.username,
          password: userData.password,
        });
      } else {
        setRegisterError(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setRegisterError('Registration failed. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-600 p-4 rounded-full">
                <Code2 className="w-12 h-12 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl">C Programming Practice Test</CardTitle>
            <CardDescription className="text-base">Login or register to start practicing</CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login"><LogIn className="w-4 h-4 mr-2" />Login</TabsTrigger>
                <TabsTrigger value="register"><UserPlus className="w-4 h-4 mr-2" />Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username">Username or Email</Label>
                    <Input
                      id="login-username"
                      type="text"
                      placeholder="Enter your username or email"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showLoginPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        disabled={isLoading}
                      />
                      <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {loginError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{loginError}</div>
                  )}

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    <LogIn className="w-5 h-5 mr-2" />{isLoading ? 'Logging in...' : 'Login'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" type="text" placeholder="First name" value={firstName}
                        onChange={(e) => setFirstName(e.target.value)} disabled={isLoading} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" type="text" placeholder="Last name" value={lastName}
                        onChange={(e) => setLastName(e.target.value)} disabled={isLoading} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="your.email@example.com" value={email}
                      onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
                    {email && isAdminUser(email) && (
                      <div className="flex items-center gap-2 text-sm text-purple-700 bg-purple-50 border border-purple-200 rounded-lg p-2">
                        <ShieldCheck className="w-4 h-4" /><span>Admin access detected</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" type="text" placeholder="Choose a username" value={username}
                      onChange={(e) => setUsername(e.target.value)} disabled={isLoading} />
                    <p className="text-xs text-gray-500">At least 3 characters</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Create a password"
                        value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">At least 6 characters</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password" value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading} />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {registerError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{registerError}</div>
                  )}

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    <UserPlus className="w-5 h-5 mr-2" />{isLoading ? 'Registering...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-6 border-t">
              <p className="text-xs text-gray-600 text-center">
                Your progress is securely stored in the cloud and synced across devices.
              </p>
            </div>

            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                <strong>Demo Admin Access:</strong><br />
                Register with any of these emails for admin dashboard:<br />
                • admin@university.edu<br />
                • teacher@university.edu<br />
                • professor@university.edu
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}