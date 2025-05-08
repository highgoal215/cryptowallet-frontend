
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { SignUp } from '@/api/auth/auth';

interface RegisterFormProps {
  onToggleForm: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleForm }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { register, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (email === "") {
      setError("Input your email");
      return;
    } else if (username === "") {
      setError("Input your username!");
      return;
    } else if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const response = await SignUp(username, email, password);
      if (response.success === true) {
        const userToken = response.user;
        console.log(userToken);
        await register(userToken);
      }
    } catch (error) {
      // Error is handled by the AuthProvider
      console.error('Registration error:', error);
    }
  };

  return (
    <Card className="w-full max-w-md border-0 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center gradient-text">Create Account</CardTitle>
        <CardDescription className="text-center">Sign up for a new FlowLux account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Email</Label>
            <Input
              id="Email"
              placeholder="Choose a email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-secondary/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="bg-secondary/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-secondary/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="bg-secondary/50"
            />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" className="w-full gradient-bg" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Register'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <button
            onClick={onToggleForm}
            className="text-primary hover:underline focus:outline-none"
          >
            Login
          </button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
