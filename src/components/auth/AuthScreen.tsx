
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold gradient-text mb-2">FlowLux</h1>
          <p className="text-xl text-muted-foreground">Crypto Vault</p>
        </div>

        {isLogin ? (
          <LoginForm onToggleForm={toggleForm} />
        ) : (
          <RegisterForm onToggleForm={toggleForm} />
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
