
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWallet } from '@/context/WalletContext';

interface WithdrawDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialWalletType?: string;
}

const WithdrawDialog: React.FC<WithdrawDialogProps> = ({ open, onOpenChange, initialWalletType = 'BTC' }) => {
  const [amount, setAmount] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [selectedWallet, setSelectedWallet] = useState<string>(initialWalletType);
  const { wallets, initiateWithdrawal, isLoading } = useWallet();

  const selectedWalletData = wallets.find(w => w.type === selectedWallet);
  
  const handleWithdraw = async () => {
    try {
      await initiateWithdrawal(selectedWallet, parseFloat(amount), address);
      onOpenChange(false);
    } catch (error) {
      console.error('Withdrawal error:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle>Withdraw Crypto</DialogTitle>
          <DialogDescription>
            Enter the details for your withdrawal. Make sure to double-check the destination address.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="wallet-type">Wallet</Label>
            <Select value={selectedWallet} onValueChange={setSelectedWallet}>
              <SelectTrigger className="bg-secondary/50">
                <SelectValue placeholder="Select wallet" />
              </SelectTrigger>
              <SelectContent>
                {wallets.map((wallet) => (
                  <SelectItem key={wallet.id} value={wallet.type}>
                    {wallet.type} ({wallet.balance} available)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.00000001"
              step="0.00000001"
              max={selectedWalletData?.balance.toString() || "0"}
              className="bg-secondary/50"
            />
            {selectedWalletData && (
              <div className="text-xs text-muted-foreground">
                Available: {selectedWalletData.balance} {selectedWalletData.type}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Destination Address</Label>
            <Input
              id="address"
              placeholder={`Enter ${selectedWallet} address`}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="bg-secondary/50"
            />
          </div>
          
          <div className="rounded bg-secondary/50 p-3 text-sm">
            <strong>Warning:</strong> Always verify the destination address. Cryptocurrency transactions cannot be reversed once initiated.
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleWithdraw} 
            disabled={
              isLoading || 
              !amount || 
              parseFloat(amount) <= 0 || 
              (selectedWalletData && parseFloat(amount) > selectedWalletData.balance) || 
              !address
            } 
            className="gradient-bg"
          >
            {isLoading ? "Processing..." : "Withdraw"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawDialog;
