
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Admin: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect non-admin users
  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have permission to access this page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} className="w-full">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button onClick={() => navigate('/')} variant="outline">
            Return to Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">2</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Pending Deposits</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">3</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Pending Withdrawals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">1</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Daily Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">$2,450</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Current status of system components</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-md">
                <span>Bitcoin Node</span>
                <span className="text-green-500 font-medium">Online</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-md">
                <span>Ethereum Node</span>
                <span className="text-green-500 font-medium">Online</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-md">
                <span>USDT Contract</span>
                <span className="text-green-500 font-medium">Online</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-md">
                <span>Banking API</span>
                <span className="text-green-500 font-medium">Online</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>System logs and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4 py-1">
                <p className="font-medium">Deposit confirmed</p>
                <p className="text-sm text-muted-foreground">User: user1 | Amount: $500 | 10 min ago</p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4 py-1">
                <p className="font-medium">Withdrawal request</p>
                <p className="text-sm text-muted-foreground">User: user2 | Amount: 0.015 BTC | 25 min ago</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4 py-1">
                <p className="font-medium">New user registered</p>
                <p className="text-sm text-muted-foreground">Username: user3 | 1 hour ago</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4 py-1">
                <p className="font-medium">Deposit confirmed</p>
                <p className="text-sm text-muted-foreground">User: user2 | Amount: $1,200 | 2 hours ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
