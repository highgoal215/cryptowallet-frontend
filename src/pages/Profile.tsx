import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { BankDetails } from '@/types';
import { useWallet } from '@/context/WalletContext';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { bankDetails } = useWallet();
  const [userInfo, setUserInfo] = useState({
    username: user?.username || '',
    email: '',
    fullName: ''
  });

  const [bankInfo, setBankInfo] = useState<BankDetails>(bankDetails || {
    accountNumber: '',
    routingNumber: '',
    referenceCode: '',
    bankName: ''
  });

  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleBankInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBankInfo({
      ...bankInfo,
      [e.target.name]: e.target.value
    });
  };

  const saveUserInfo = () => {
    // In a real app, this would update the user in the database
    toast.success("User information updated successfully!");
  };

  const saveBankInfo = () => {
    // In a real app, this would update the bank details in the database
    toast.success("Bank information updated successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <Navbar />
      
      <div className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>

          <Tabs defaultValue="user-info" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="user-info">User Information</TabsTrigger>
              <TabsTrigger value="bank-info">Bank Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="user-info">
              <Card>
                <CardHeader>
                  <CardTitle>User Information</CardTitle>
                  <CardDescription>Update your personal details here</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid w-full items-center gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input 
                      id="username"
                      name="username"
                      value={userInfo.username}
                      onChange={handleUserInfoChange}
                      placeholder="Username"
                    />
                  </div>
                  
                  <div className="grid w-full items-center gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      value={userInfo.email}
                      onChange={handleUserInfoChange}
                      placeholder="Email address"
                    />
                  </div>
                  
                  <div className="grid w-full items-center gap-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input 
                      id="fullName"
                      name="fullName"
                      value={userInfo.fullName}
                      onChange={handleUserInfoChange}
                      placeholder="Full name"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={saveUserInfo}>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="bank-info">
              <Card>
                <CardHeader>
                  <CardTitle>Bank Details</CardTitle>
                  <CardDescription>Manage your bank account information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid w-full items-center gap-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input 
                      id="bankName"
                      name="bankName"
                      value={bankInfo.bankName}
                      onChange={handleBankInfoChange}
                      placeholder="Bank name"
                    />
                  </div>
                  
                  <div className="grid w-full items-center gap-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input 
                      id="accountNumber"
                      name="accountNumber"
                      value={bankInfo.accountNumber}
                      onChange={handleBankInfoChange}
                      placeholder="Account number"
                    />
                  </div>
                  
                  <div className="grid w-full items-center gap-2">
                    <Label htmlFor="routingNumber">Routing Number</Label>
                    <Input 
                      id="routingNumber"
                      name="routingNumber"
                      value={bankInfo.routingNumber}
                      onChange={handleBankInfoChange}
                      placeholder="Routing number"
                    />
                  </div>
                  
                  <div className="grid w-full items-center gap-2">
                    <Label htmlFor="referenceCode">Reference Code</Label>
                    <Input 
                      id="referenceCode"
                      name="referenceCode"
                      value={bankInfo.referenceCode}
                      onChange={handleBankInfoChange}
                      placeholder="Reference code"
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">This code is generated automatically</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={saveBankInfo}>Save Bank Details</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
