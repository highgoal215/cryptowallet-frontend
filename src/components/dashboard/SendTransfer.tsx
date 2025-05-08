
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWallet } from '@/context/WalletContext';
import { toast } from 'sonner';
import { Transfer } from '@/api/wallet/wallet';

interface TransferDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentWalletAddress?: string;
}

const TransferDialog: React.FC<TransferDialogProps> = ({ open, onOpenChange, currentWalletAddress }) => {
    const [amount, setAmount] = useState<string>('100');
    const { isLoading, updateTwoWallets } = useWallet();
    const [isReceiveAddress, setIsReceiveAddress] = useState<string>("");

    const handleTransfer = async () => {
        if (isReceiveAddress === "") {
            toast.error("Error! Please input receive address");
            return;
        } else if (amount === "0" || amount === "") {
            toast.error("Error! Please input amount");
        } else {
            try {
                const response = await Transfer(currentWalletAddress, isReceiveAddress, amount);
                console.log(response);
                if (response.success === true) {
                    updateTwoWallets(currentWalletAddress, isReceiveAddress, Number(amount));
                    onOpenChange(false);
                }
            } catch (error) {
                console.error("Transfer error ", error);
            }
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-card border-border">
                <DialogHeader>
                    <DialogTitle>Transfer</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="amount">Receive Address</Label>
                        <Input
                            id="amount"
                            type="text"
                            value={isReceiveAddress}
                            onChange={(e) => setIsReceiveAddress(e.target.value)}
                            min="10"
                            step="10"
                            className="bg-secondary/50"
                        />
                    </div>
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
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleTransfer} disabled={isLoading || !amount || parseFloat(amount) <= 0} className="gradient-bg">
                        {isLoading ? "Processing..." : "Transfer"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default TransferDialog;