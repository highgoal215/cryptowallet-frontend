export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  isAdmin?: boolean; // Added isAdmin property as optional
}

export interface Wallet {
  id: string;
  type: 'BTC' | 'ETH' | 'USDT';
  name?: string;
  address: string;
  balance: number;
  usdValue: number;
}

export interface BankDetails {
  accountNumber: string;
  routingNumber: string;
  referenceCode: string;
  bankName: string;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'swap' | 'buy';
  status: 'pending' | 'completed' | 'failed';
  amount: number;
  cryptocurrency: string;
  timestamp: Date;
  address?: string;
  referenceCode?: string;
  fromCurrency?: string;
  toCurrency?: string;
}
