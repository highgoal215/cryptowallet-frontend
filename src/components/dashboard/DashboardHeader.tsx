
import React from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useWallet } from "@/context/WalletContext";
import { RefreshCw } from "lucide-react";

const DashboardHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const { totalBalanceUSD, isLoading, refreshWallets } = useWallet();
  
  const formattedBalance = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(totalBalanceUSD);

  return (
    <div className="flex flex-col md:flex-row w-full justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {user?.username}</h1>
        <div className="flex items-center gap-2 mt-2">
          <p className="text-xl font-medium">Total Balance:</p>
          <p className="text-2xl font-bold gradient-text">{formattedBalance}</p>
          {/* <Button 
            variant="outline" 
            size="icon" 
            onClick={refreshWallets}
            disabled={isLoading}
            className="h-8 w-8"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button> */}
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={logout} className="bg-secondary/50">
          Logout
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
