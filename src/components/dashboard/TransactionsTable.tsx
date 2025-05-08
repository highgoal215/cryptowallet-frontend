
import React from 'react';
import { Transaction } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight } from "lucide-react";

interface TransactionsTableProps {
  transactions: Transaction[];
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ transactions }) => {
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case 'withdrawal':
        return <ArrowUpRight className="h-4 w-4 text-amber-500" />;
      case 'swap':
        return <ArrowLeftRight className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <Card className="bg-card/80">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No transactions yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-2 pl-4 pr-2 font-medium">Type</th>
                  <th className="pb-2 px-2 font-medium">Date</th>
                  <th className="pb-2 px-2 font-medium">Amount</th>
                  <th className="pb-2 px-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-border/50 hover:bg-secondary/20">
                    <td className="py-3 pl-4 pr-2">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(tx.type)}
                        <span className="capitalize">{tx.type}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">{formatDate(tx.timestamp)}</td>
                    <td className="py-3 px-2">
                      <span className={tx.type === 'deposit' ? 'text-green-500' : tx.type === 'withdrawal' ? 'text-amber-500' : ''}>
                        {tx.type === 'deposit' ? '+' : tx.type === 'withdrawal' ? '-' : ''}
                        {tx.amount} {tx.cryptocurrency}
                      </span>
                    </td>
                    <td className="py-3 px-2">{getStatusBadge(tx.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionsTable;
