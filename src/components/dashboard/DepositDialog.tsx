
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWallet } from '@/context/WalletContext';

interface DepositDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DepositDialog: React.FC<DepositDialogProps> = ({ open, onOpenChange }) => {
  const [amount, setAmount] = useState<string>('100');
  const { initiateDeposit, isLoading } = useWallet();

  const handleDeposit = async () => {
    try {
      await initiateDeposit(parseFloat(amount));
      onOpenChange(false);
    } catch (error) {
      console.error('Deposit error:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle>Deposit Funds</DialogTitle>
          <DialogDescription>
            Enter the amount you want to deposit. The amount will be credited to your account after we receive your bank transfer.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (USD)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="10"
              step="10"
              className="bg-secondary/50"
            />
          </div>
          
          <div className="rounded bg-secondary/50 p-3 text-sm">
            <strong>Note:</strong> Make sure to include your reference code with your bank transfer. Your account will be credited once we confirm your payment.
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleDeposit} disabled={isLoading || !amount || parseFloat(amount) <= 0} className="gradient-bg">
            {isLoading ? "Processing..." : "Initiate Deposit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DepositDialog;
