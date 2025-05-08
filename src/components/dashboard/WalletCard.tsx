
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet as WalletType } from "@/types";
import { Bitcoin, Wallet, DollarSign, Send, QrCode, DollarSignIcon, LucideArrowRightLeft } from "lucide-react";
import { Button } from '@/components/ui/button';
import TransferDialog from './SendTransfer';

interface WalletCardProps {
  wallet: WalletType;
  onDepositClick: () => void;
  onWithdrawClick: () => void;
}

const WalletCard: React.FC<WalletCardProps> = ({ wallet, onDepositClick, onWithdrawClick }) => {
  const { type, name, address, balance, usdValue } = wallet;
  const [isOpenTransferDialog, setIsOpenTransferDialog] = useState<boolean>(false);

  const formattedBalance = balance.toLocaleString(undefined, {
    maximumFractionDigits: type === 'USDT' ? 2 : 8
  });

  const formattedUsdValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(usdValue);

  const getIcon = () => {
    switch (type) {
      case 'BTC':
        return <Bitcoin className="h-5 w-5 text-crypto-btc" />;
      case 'ETH':
        return <Wallet className="h-5 w-5 text-crypto-eth" />;
      case 'USDT':
        return <DollarSign className="h-5 w-5 text-crypto-usdt" />;
      default:
        return <Wallet className="h-5 w-5" />;
    }
  };

  const shortenAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <Card className={`${type.toLowerCase()} bg-card`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              {getIcon()}
              <span>{name || type}</span>
            </div>
            <span className="text-xs font-normal text-muted-foreground">{type}</span>
          </CardTitle>
          <span className="text-sm text-muted-foreground">{shortenAddress(address)}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <p className="text-2xl font-bold">{formattedBalance} {type}</p>
            <p className="text-sm text-muted-foreground">{formattedUsdValue}</p>
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              onClick={onDepositClick}
              variant="secondary"
              size="sm"
              className="flex-1 cursor-pointer"
            >
              Deposit
            </Button>
            <Button
              onClick={onWithdrawClick}
              variant="outline"
              size="sm"
              className="flex-1 bg-background"
            >
              Withdraw
            </Button>
          </div>
          <div className='grid grid-cols-4 place-content-center place-items-center gap-2'>
            <Button
              variant="secondary"
              size="sm"
              className="w-full flex justify-center items-center"
            >
              <QrCode />
              Receive
            </Button>
            <Button
              onClick={() => setIsOpenTransferDialog(true)}
              variant="secondary"
              size="sm"
              className="w-full flex justify-center items-center"
            >
              <Send />
              Send
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="w-full flex justify-center items-center"
            >
              <LucideArrowRightLeft />
              Swap
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="w-full flex justify-center items-center"
            >
              <DollarSignIcon />
              Buy
            </Button>
          </div>
        </div>
      </CardContent>
      <TransferDialog open={isOpenTransferDialog} onOpenChange={setIsOpenTransferDialog} currentWalletAddress={address} />
    </Card>
  );
};

export default WalletCard;
