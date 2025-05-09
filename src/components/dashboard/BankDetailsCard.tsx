
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BankDetails } from "@/types";
import { Button } from "@/components/ui/button";
import {  Copy } from "lucide-react";
import { useToast } from '@/components/ui/use-toast';

interface BankDetailsCardProps {
  bankDetails: BankDetails;
  onDepositClick: () => void;
}

const BankDetailsCard: React.FC<BankDetailsCardProps> = ({ bankDetails, onDepositClick }) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string, description: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description,
    });
  };

  return (
    <Card className="bg-card/80">
      <CardHeader>
        <CardTitle>Bank Deposit Details</CardTitle>
        <CardDescription>Use these details to deposit funds via bank transfer</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div className="text-sm text-muted-foreground">Bank Name</div>
          <div className="text-sm font-medium flex items-center justify-between">
            {bankDetails.bankName}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => copyToClipboard(bankDetails.bankName, "Bank name copied")}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">Account Number</div>
          <div className="text-sm font-medium flex items-center justify-between">
            {bankDetails.accountNumber}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => copyToClipboard(bankDetails.accountNumber, "Account number copied")}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">Routing Number</div>
          <div className="text-sm font-medium flex items-center justify-between">
            {bankDetails.routingNumber}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => copyToClipboard(bankDetails.routingNumber, "Routing number copied")}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">Reference Code</div>
          <div className="text-sm font-medium flex items-center justify-between font-mono bg-secondary/50 p-1 rounded">
            {bankDetails.referenceCode}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => copyToClipboard(bankDetails.referenceCode, "Reference code copied")}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="rounded bg-secondary/50 p-3 text-sm">
          <strong>Important:</strong> Always include your unique reference code with your transfer to ensure your deposit is credited to your account.
        </div>

        <Button onClick={onDepositClick} className="w-full gradient-bg">
          Make a Deposit
        </Button>
      </CardContent>
    </Card>
  );
};

export default BankDetailsCard;
