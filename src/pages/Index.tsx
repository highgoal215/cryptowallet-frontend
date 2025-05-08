
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import AuthScreen from '@/components/auth/AuthScreen';
import Dashboard from '@/pages/Dashboard';
import { WalletProvider } from '@/context/WalletContext';

const Index: React.FC = () => {
  const { user, isLoading } = useAuth();

  // Show loading indicator while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary">
        <div className="animate-pulse-slow">
          <h2 className="text-4xl font-bold gradient-text">FlowLux</h2>
          <p className="text-center mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login screen if user is not authenticated
  if (!user) {
    return <AuthScreen />;
  }

  // Show dashboard if user is authenticated
  return (
    <WalletProvider>
      <Dashboard />
    </WalletProvider>
  );
};

export default Index;
