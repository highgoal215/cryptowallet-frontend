
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { useWallet } from '@/context/WalletContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowDownLeft, ArrowUpRight, ArrowLeftRight, 
  CalendarIcon, RefreshCw, ShoppingBag 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell 
} from '@/components/ui/table';
import { 
  Popover, PopoverContent, PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Transaction } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRange } from 'react-day-picker';

const TransactionHistory: React.FC = () => {
  const { transactions, refreshWallets, isLoading } = useWallet();
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  const filteredTransactions = transactions.filter(tx => {
    // Filter by type
    if (filterType && filterType !== 'all-types' && tx.type !== filterType) return false;
    
    // Filter by status
    if (filterStatus && filterStatus !== 'all-statuses' && tx.status !== filterStatus) return false;
    
    // Filter by date range
    if (dateRange.from && new Date(tx.timestamp) < dateRange.from) return false;
    if (dateRange.to) {
      const endDate = new Date(dateRange.to);
      endDate.setHours(23, 59, 59, 999); // End of day
      if (new Date(tx.timestamp) > endDate) return false;
    }
    
    return true;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case 'withdrawal':
        return <ArrowUpRight className="h-4 w-4 text-amber-500" />;
      case 'swap':
        return <ArrowLeftRight className="h-4 w-4 text-blue-500" />;
      case 'buy':
        return <ShoppingBag className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-600">Completed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), 'MMM d, yyyy - h:mm a');
  };

  const handleResetFilters = () => {
    setFilterType(null);
    setFilterStatus(null);
    setDateRange({ from: undefined, to: undefined });
  };

  const renderTransactionDetails = (tx: Transaction) => {
    switch (tx.type) {
      case 'deposit':
        return (
          <>
            <span className="text-green-500">+{tx.amount} {tx.cryptocurrency}</span>
            {tx.referenceCode && (
              <div className="text-xs text-muted-foreground mt-1">
                Ref: {tx.referenceCode}
              </div>
            )}
          </>
        );
      case 'withdrawal':
        return (
          <>
            <span className="text-amber-500">-{tx.amount} {tx.cryptocurrency}</span>
            {tx.address && (
              <div className="text-xs text-muted-foreground mt-1">
                To: {tx.address.substring(0, 6)}...{tx.address.substring(tx.address.length - 4)}
              </div>
            )}
          </>
        );
      case 'swap':
        return (
          <span className="text-blue-500">
            {tx.amount} {tx.fromCurrency} → {tx.cryptocurrency}
          </span>
        );
      case 'buy':
        return (
          <span className="text-purple-500">
            +{tx.amount} {tx.cryptocurrency}
          </span>
        );
      default:
        return tx.amount;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <Navbar />
      
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold">Transaction History</h1>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="h-9"
                onClick={() => refreshWallets()} 
                disabled={isLoading}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              <Button 
                variant="secondary" 
                size="sm" 
                className="h-9"
                onClick={handleResetFilters}
              >
                Clear Filters
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-card/80">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Filter by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={filterType || "all-types"} onValueChange={(value) => setFilterType(value === "all-types" ? null : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-types">All Types</SelectItem>
                    <SelectItem value="deposit">Deposit</SelectItem>
                    <SelectItem value="withdrawal">Withdrawal</SelectItem>
                    <SelectItem value="swap">Swap</SelectItem>
                    <SelectItem value="buy">Buy</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
            
            <Card className="bg-card/80">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Filter by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={filterStatus || "all-statuses"} onValueChange={(value) => setFilterStatus(value === "all-statuses" ? null : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-statuses">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
            
            <Card className="bg-card/80 md:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Filter by Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "MMM d, yyyy")} -{" "}
                            {format(dateRange.to, "MMM d, yyyy")}
                          </>
                        ) : (
                          format(dateRange.from, "MMM d, yyyy")
                        )
                      ) : (
                        <span>Select date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-card/80">
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>Transactions</span>
                <span className="text-muted-foreground text-sm font-normal">
                  {filteredTransactions.length} {filteredTransactions.length === 1 ? 'transaction' : 'transactions'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No transactions found matching your filters</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getTypeIcon(tx.type)}
                              <span className="capitalize">{tx.type}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(tx.timestamp)}
                          </TableCell>
                          <TableCell>
                            {renderTransactionDetails(tx)}
                          </TableCell>
                          <TableCell>{getStatusBadge(tx.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
