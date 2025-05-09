import React, { createContext, useContext, useState, useEffect } from "react";
import { Wallet, BankDetails, Transaction } from "../types";
import { useAuth } from "./AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface WalletContextType {
  wallets: Wallet[];
  importedWallets: Wallet[];
  bankDetails: BankDetails | null;
  transactions: Transaction[];
  isLoading: boolean;
  totalBalanceUSD: number;
  initiateDeposit: (amount: number) => Promise<void>;
  initiateWithdrawal: (walletType: string, amount: number, address: string) => Promise<void>;
  refreshWallets: () => Promise<void>;
  createWallet: (type: 'BTC' | 'ETH' | 'TRX', name?: string, address?: string, balance?: string) => Promise<void>;
  importWallet: (address: string, accountName: string, accountType: string, balance: string) => Promise<void>;
  getAllWallets: (address: string, accountName: string, accountType: string, balance: string) => Promise<void>;
  updateTwoWallets: (sendAddress: string, receiveAddress: string, amount: number) => Promise<void>;
  initiateSwap: (fromWalletType: string, toWalletType: string, amount: number) => Promise<void>;
  buyToken: (walletType: string, amount: number) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

function generateRandomAddress(type: 'BTC' | 'ETH' | 'TRX'): string {
  if (type === 'BTC') {
    return `bc1${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
  } else if (type === 'ETH' || type === 'TRX') {
    return `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
  }
  return '';
}

function generateBankDetails(): BankDetails {
  return {
    accountNumber: `${Math.floor(Math.random() * 10000000000)}`.padStart(10, '0'),
    routingNumber: '072403473',
    referenceCode: `FLX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    bankName: 'FlowLux Banking Partner'
  };
}

function generateMockTransactions(userId: string): Transaction[] {
  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date;
  });

  const cryptoTypes = ["BTC", "ETH", "TRX"];
  const transactionTypes: ('deposit' | 'withdrawal' | 'swap')[] = ["deposit", "withdrawal", "swap"];
  const statuses: ('pending' | 'completed' | 'failed')[] = ["completed", "completed", "completed", "pending"];

  return past7Days.flatMap(date => {
    // Generate 0-3 transactions per day
    return Array.from({ length: Math.floor(Math.random() * 4) }, () => ({
      id: `tx-${Math.random().toString(36).substring(2, 10)}`,
      type: transactionTypes[Math.floor(Math.random() * transactionTypes.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      amount: parseFloat((Math.random() * 2).toFixed(6)),
      cryptocurrency: cryptoTypes[Math.floor(Math.random() * cryptoTypes.length)],
      timestamp: new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        Math.floor(Math.random() * 24),
        Math.floor(Math.random() * 60)
      ),
      address: Math.random() > 0.5 ? generateRandomAddress('ETH') : undefined,
      referenceCode: Math.random() > 0.5 ? `FLX-${Math.random().toString(36).substring(2, 8).toUpperCase()}` : undefined
    }));
  });
}

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [importedWallets, setImportedWallet] = useState<Wallet[]>([]);
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const totalBalanceUSD = wallets.reduce((sum, wallet) => sum + wallet.usdValue, 0);

  // Initialize user wallets and bank details
  useEffect(() => {
    if (user) {
      setIsLoading(true);
      // Simulate loading data
      setTimeout(() => {
        // Create wallets for the user if they don't exist
        const userWallets = [];

        setWallets(userWallets);
        setBankDetails(generateBankDetails());
        setTransactions(generateMockTransactions(user.id));

        // Simulate fetching price data
        refreshWallets();
        setIsLoading(false);
      }, 1000);
    } else {
      // Clear data if user logs out
      setWallets([]);
      setBankDetails(null);
      setTransactions([]);
    }
  }, [user]);

  const refreshWallets = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Simulate API call to get latest prices
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock prices (in a real app, we would fetch from an API)
      const prices = {
        BTC: 55000 + Math.random() * 1000,
        ETH: 3000 + Math.random() * 200,
        TRX: 1.0
      };

      setWallets(current =>
        current.map(wallet => ({
          ...wallet,
          usdValue: wallet.balance * prices[wallet.type]
        }))
      );
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Refresh Failed",
        description: "Could not update wallet information",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const initiateDeposit = async (amount: number) => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (amount <= 0) {
        throw new Error("Amount must be greater than 0");
      }

      // Create a new transaction
      const newTransaction: Transaction = {
        id: `tx-${Date.now()}`,
        type: 'deposit',
        status: 'pending',
        amount,
        cryptocurrency: 'USDT', // Default to USDT for fiat deposits
        timestamp: new Date(),
        referenceCode: bankDetails?.referenceCode
      };

      setTransactions(prev => [newTransaction, ...prev]);

      toast({
        title: "Deposit Initiated",
        description: `Please transfer $${amount} to the provided bank account with your reference code.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Deposit Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const initiateWithdrawal = async (walletType: string, amount: number, address: string) => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (amount <= 0) {
        throw new Error("Amount must be greater than 0");
      }

      const wallet = wallets.find(w => w.type === walletType);

      if (!wallet) {
        throw new Error(`No ${walletType} wallet found`);
      }

      if (wallet.balance < amount) {
        throw new Error("Insufficient balance");
      }

      if (!address) {
        throw new Error("Withdrawal address is required");
      }

      // Create a new transaction
      const newTransaction: Transaction = {
        id: `tx-${Date.now()}`,
        type: 'withdrawal',
        status: 'pending',
        amount,
        cryptocurrency: walletType,
        timestamp: new Date(),
        address
      };

      setTransactions(prev => [newTransaction, ...prev]);

      // Update wallet balance (simulating blockchain confirmation)
      setWallets(current =>
        current.map(w =>
          w.type === walletType
            ? { ...w, balance: w.balance - amount }
            : w
        )
      );

      toast({
        title: "Withdrawal Initiated",
        description: `Your withdrawal of ${amount} ${walletType} is being processed.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Withdrawal Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createWallet = async (type: 'BTC' | 'ETH' | 'TRX', name?: string, address?: string, balance?: string) => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (!user) {
        throw new Error("User must be logged in to create a wallet");
      }

      const walletName = name || `My ${type} Wallet ${wallets.filter(w => w.type === type).length + 1}`;
      const newWallet: Wallet = {
        id: `${type.toLowerCase()}-${Date.now()}`,
        type,
        name: walletName,
        address: address,
        balance: Number(balance),
        usdValue: 0
      };

      setWallets(prev => [...prev, newWallet]);

      toast({
        title: "Wallet Created",
        description: `Your new ${type} wallet "${walletName}" has been created successfully.`,
      });

      refreshWallets();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Wallet Creation Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const importWallet = async (address: string, accountName: string, addressType: 'BTC' | 'ETH' | 'TRX', balance: string) => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (!user) throw new Error("User must be logged in to import a wallet");

      const importedWallet: Wallet = {
        id: `${addressType.toLowerCase()}-${Date.now()}`,
        type: addressType,
        name: accountName,
        address: address,
        balance: Number(balance),
        usdValue: 0
      }

      setImportedWallet(prev => [...prev, importedWallet]);
      localStorage.removeItem("importwallet");
      localStorage.setItem("importwallet", JSON.stringify(importedWallet));

      refreshWallets();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Wallet Import Failed",
        description: error instanceof Error ? error.message : "An unkown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const getAllWallets = async (address: string, accountName: string, addressType: 'BTC' | 'ETH' | 'TRX', balance: string) => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (!user) throw new Error("User must be logged in to import a wallet");

      const getWallets: Wallet = {
        id: `${addressType.toLowerCase()}-${Date.now()}`,
        type: addressType,
        name: accountName,
        address: address,
        balance: Number(balance),
        usdValue: 0
      }

      setWallets(prev => [...prev, getWallets]);
      localStorage.removeItem("importwallet");
      localStorage.setItem("importwallet", JSON.stringify(getWallets));

      refreshWallets();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Wallet Import Failed",
        description: error instanceof Error ? error.message : "An unkown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const updateTwoWallets = async (sendAddress: string, receiveAddress: string, amount: number): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API delay (optional)
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update state
      setWallets(prev => {
        return prev.map(wallet => {
          if (wallet.address === sendAddress) {
            return { ...wallet, balance: wallet.balance - amount };
          }
          if (wallet.address === receiveAddress) {
            return { ...wallet, balance: wallet.balance + amount };
          }
          return wallet;
        });
      });

      // Update localStorage if applicable
      const stored = localStorage.getItem("importwallet");
      console.log(stored);
      if (stored) {
        const parsedWallet: Wallet = JSON.parse(stored);
        if (parsedWallet.address === sendAddress) {
          parsedWallet.balance -= amount;
          localStorage.setItem("importwallet", JSON.stringify(parsedWallet));
        } else if (parsedWallet.address === receiveAddress) {
          parsedWallet.balance += amount;
          localStorage.setItem("importwallet", JSON.stringify(parsedWallet));
        }
      }

      await refreshWallets(); // Optional if you want to force re-sync

      console.log(importedWallets);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const initiateSwap = async (fromWalletType: string, toWalletType: string, amount: number) => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (amount <= 0) {
        throw new Error("Amount must be greater than 0");
      }

      const fromWallet = wallets.find(w => w.type === fromWalletType);
      const toWallet = wallets.find(w => w.type === toWalletType);

      if (!fromWallet || !toWallet) {
        throw new Error("Both source and destination wallets must exist");
      }

      if (fromWallet.balance < amount) {
        throw new Error("Insufficient balance");
      }

      // Mock exchange rates
      const rates = {
        BTC: 55000,
        ETH: 3000,
        TRX: 1.0
      };

      const fromValueUSD = amount * rates[fromWalletType as keyof typeof rates];
      const toAmount = fromValueUSD / rates[toWalletType as keyof typeof rates];

      // Create a new transaction
      const newTransaction: Transaction = {
        id: `tx-${Date.now()}`,
        type: 'swap',
        status: 'completed',
        amount: amount,
        cryptocurrency: fromWalletType,
        timestamp: new Date(),
        fromCurrency: fromWalletType,
        toCurrency: toWalletType
      };

      setTransactions(prev => [newTransaction, ...prev]);

      // Update wallet balances
      setWallets(current =>
        current.map(w => {
          if (w.type === fromWalletType) {
            return { ...w, balance: w.balance - amount };
          } else if (w.type === toWalletType) {
            return { ...w, balance: w.balance + toAmount };
          }
          return w;
        })
      );

      toast({
        title: "Swap Completed",
        description: `Successfully swapped ${amount} ${fromWalletType} to ${toAmount.toFixed(6)} ${toWalletType}.`,
      });

      refreshWallets();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Swap Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const buyToken = async (walletType: string, amount: number) => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (amount <= 0) {
        throw new Error("Amount must be greater than 0");
      }

      const wallet = wallets.find(w => w.type === walletType);

      if (!wallet) {
        throw new Error(`No ${walletType} wallet found`);
      }

      // Create a new transaction
      const newTransaction: Transaction = {
        id: `tx-${Date.now()}`,
        type: 'buy',
        status: 'completed',
        amount,
        cryptocurrency: walletType,
        timestamp: new Date(),
      };

      setTransactions(prev => [newTransaction, ...prev]);

      // Update wallet balance
      setWallets(current =>
        current.map(w =>
          w.type === walletType
            ? { ...w, balance: w.balance + amount }
            : w
        )
      );

      toast({
        title: "Purchase Completed",
        description: `Successfully bought ${amount} ${walletType}.`,
      });

      refreshWallets();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Purchase Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        wallets,
        importedWallets,
        bankDetails,
        transactions,
        isLoading,
        totalBalanceUSD,
        initiateDeposit,
        initiateWithdrawal,
        refreshWallets,
        createWallet,
        importWallet,
        getAllWallets,
        updateTwoWallets,
        initiateSwap,
        buyToken
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};