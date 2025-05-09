
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import BankDetailsCard from '@/components/dashboard/BankDetailsCard';
import TransactionsTable from '@/components/dashboard/TransactionsTable';
import DepositDialog from '@/components/dashboard/DepositDialog';
import WithdrawDialog from '@/components/dashboard/WithdrawDialog';
import { useWallet } from '@/context/WalletContext';

const Dashboard: React.FC = () => {
  const { bankDetails, transactions } = useWallet();
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [selectedWalletType, setSelectedWalletType] = useState<string>('BTC');

  const handleDepositClick = () => {
    setIsDepositOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <Navbar />

      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <DashboardHeader />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-1">
              {bankDetails && (
                <BankDetailsCard
                  bankDetails={bankDetails}
                  onDepositClick={handleDepositClick}
                />
              )}
            </div>

            <div className="lg:col-span-2">
              <TransactionsTable transactions={transactions} />
            </div>
          </div>

          <DepositDialog
            open={isDepositOpen}
            onOpenChange={setIsDepositOpen}
          />

          <WithdrawDialog
            open={isWithdrawOpen}
            onOpenChange={setIsWithdrawOpen}
            initialWalletType={selectedWalletType}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
