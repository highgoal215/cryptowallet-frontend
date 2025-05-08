
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Login } from '@/api/auth/auth';
import { useToast } from '@/components/ui/use-toast';

interface LoginFormProps {
  onToggleForm: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleForm }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await Login(identifier, password);
      if (response.success === true) {
        const userToken = response.userObject;
        await login(userToken);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid username/email or password",
      });
    }
  };

  return (
    <Card className="w-full max-w-md border-0 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center gradient-text">Login to FlowLux</CardTitle>
        <CardDescription className="text-center">Enter your credentials to access your wallets</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="identifier">Username or Email</Label>
            <Input
              id="identifier"
              placeholder="Enter your username or email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="bg-secondary/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-secondary/50"
            />
          </div>
          <Button type="submit" className="w-full gradient-bg" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <button
            onClick={onToggleForm}
            className="text-primary hover:underline focus:outline-none"
          >
            Register
          </button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
