
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { useWallet } from '@/context/WalletContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet, Plus, ArrowLeftRight, DownloadIcon } from 'lucide-react';
import WalletCard from '@/components/dashboard/WalletCard';
import DepositDialog from '@/components/dashboard/DepositDialog';
import WithdrawDialog from '@/components/dashboard/WithdrawDialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { CreateNewWallet, GetAllWallets, ImportWallet } from '@/api/wallet/wallet';

const Wallets: React.FC = () => {
  const { wallets, importedWallets, createWallet, initiateSwap, importWallet, getAllWallets } = useWallet();
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [selectedWalletType, setSelectedWalletType] = useState<string>('BTC');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newWalletType, setNewWalletType] = useState<string>("BTC");
  const [newWalletName, setNewWalletName] = useState<string>("");
  const [isSwapOpen, setIsSwapOpen] = useState(false);
  const [swapFromWallet, setSwapFromWallet] = useState<string>("");
  const [swapToWallet, setSwapToWallet] = useState<string>("");
  const [swapAmount, setSwapAmount] = useState<number>(0);
  const [isImportWalletOpen, setIsImportWalletOpen] = useState<boolean>(false);
  const [isWalletName, setIsWalletName] = useState<string>("");
  const [isWalletPrivateKey, setIsWalletPrivateKey] = useState<string>("");
  const [iswalletType, setIsWalletType] = useState<string>("");
  const [isCheck, setIsCheck] = useState<boolean>(false);

  const handleDepositClick = () => {
    setIsDepositOpen(true);
  };

  const handleWithdrawClick = (walletType: string) => {
    setSelectedWalletType(walletType);
    setIsWithdrawOpen(true);
  };

  const handleSwapClick = () => {
    if (!wallets.length) {
      toast.error("You need at least two wallets to perform a swap");
      return;
    }

    setSwapFromWallet(wallets[0].type);

    // Set a different wallet type for to if possible
    const otherType = wallets.find(w => w.type !== wallets[0].type)?.type || wallets[0].type;
    setSwapToWallet(otherType);

    setIsSwapOpen(true);
  };

  const handleCreateWallet = async () => {
    try {
      let newWallet = "";
      if (newWalletType === 'BTC') newWallet = 'bitcoin';
      else if (newWalletType === "ETH") newWallet = 'ethereum';
      else newWallet = 'tron';
      const response = await CreateNewWallet(newWallet, newWalletName);
      if (response) {
        await createWallet(newWalletType as 'BTC' | 'ETH' | 'TRX', newWalletName, response.address, response.balance);
        setIsCreateOpen(false);
        setNewWalletName("");
        setIsCheck(false);
      }
    } catch (error) {
      console.error("Error creating wallet:", error);
    }
  };

  const handleSwapSubmit = async () => {
    if (swapFromWallet === swapToWallet) {
      toast.error("Cannot swap to the same currency");
      return;
    }

    try {
      await initiateSwap(swapFromWallet, swapToWallet, swapAmount);
      setIsSwapOpen(false);
      setSwapAmount(0);
    } catch (error) {
      console.error("Error performing swap:", error);
    }
  };

  const handleImportWalletSubmit = async () => {
    if (isWalletName === "") {
      toast.error("Error! Please input your wallet name");
      return;
    } else if (isWalletPrivateKey === "") {
      toast.error("Error! Please input your wallet private key");
      return;
    } else if (iswalletType === "Select wallet type") {
      toast.error("Error! Please select wallet type");
      return;
    } else {
      let addressType = "";

      if (iswalletType === "BTC") addressType = "bitcoin";
      else if (iswalletType === "ETH") addressType = "ethereum";
      else if (iswalletType === "TRX") addressType = "tron"

      try {
        const response = await ImportWallet(isWalletPrivateKey, isWalletName, addressType);
        if (response.message === "Wallet imported successfully") {
          localStorage.setItem("importwallet", JSON.stringify(response.wallet));
          await importWallet(response.wallet.address, isWalletName, iswalletType as 'BTC' | 'ETH' | 'TRX', response.wallet.balance);
          setIsImportWalletOpen(false);
          setIsCheck(true);
        }
      } catch (error) {
        console.error("Error Import wallet: ", error);
      }
    }
  }

  useEffect(() => {
    const getFetchAllWallets = async () => {
      const response = await GetAllWallets();

      if (response.success === true) {
        localStorage.removeItem("wallet");
        localStorage.setItem("wallet", JSON.stringify(response));
        console.log(response.wallets)

        for (let i = 0; i < response.wallets.length; i++) {
          let iswalletType = "";

          if (response.wallets[i].addressType === "bitcoin") iswalletType = "BTC";
          else if (response.wallets[i].addressType === "etherium") iswalletType = "ETH";
          else iswalletType = "TRX";
          await getAllWallets(response.wallets[i].address, response.wallets[i].accountName, iswalletType as 'BTC' | 'ETH' | 'TRX', response.wallets[i].balance);
        }
      }
    }
    getFetchAllWallets();
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <Navbar />

      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My Wallets</h1>
            <div className="flex gap-2">

              <Dialog open={isImportWalletOpen} onOpenChange={setIsImportWalletOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <DownloadIcon className="mr-2 h-4 w-4" /> Wallet Import
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Import Your Wallet</DialogTitle>
                  </DialogHeader>
                  <div className="py-4 space-y-4">
                    <Select value={iswalletType} onValueChange={setIsWalletType}>
                      <SelectTrigger id="walletType" className="w-full">
                        <SelectValue placeholder="Select wallet type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                        <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                        <SelectItem value="TRX">Tron (TRX)</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="space-y-2">
                      <label htmlFor="fromWallet" className="text-sm font-medium">Wallet Name</label>
                      <Input
                        id="amount"
                        type="text"
                        value={isWalletName}
                        onChange={(e) => setIsWalletName(e.target.value)}
                        min="0.00000001"
                        step="0.00000001"
                        className="bg-secondary/50"
                        placeholder='Input your wallet name'
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="toWallet" className="text-sm font-medium">Private key</label>
                      <Input
                        id="amount"
                        type="text"
                        value={isWalletPrivateKey}
                        onChange={(e) => setIsWalletPrivateKey(e.target.value)}
                        min="0.00000001"
                        step="0.00000001"
                        className="bg-secondary/50"
                        placeholder='Input your wallet private key'
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleImportWalletSubmit}>
                      <DownloadIcon className="mr-2 h-4 w-4" /> Import
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isSwapOpen} onOpenChange={setIsSwapOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <ArrowLeftRight className="mr-2 h-4 w-4" /> Swap
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Swap Cryptocurrencies</DialogTitle>
                    <DialogDescription>
                      Exchange cryptocurrency from one wallet to another.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4 space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="fromWallet" className="text-sm font-medium">From Wallet</label>
                      <Select value={swapFromWallet} onValueChange={setSwapFromWallet}>
                        <SelectTrigger id="fromWallet" className="w-full">
                          <SelectValue placeholder="Select wallet" />
                        </SelectTrigger>
                        <SelectContent>
                          {wallets.map((wallet) => (
                            <SelectItem key={wallet.id} value={wallet.type}>
                              {wallet.name || wallet.type} ({wallet.balance} {wallet.type})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="toWallet" className="text-sm font-medium">To Wallet</label>
                      <Select value={swapToWallet} onValueChange={setSwapToWallet}>
                        <SelectTrigger id="toWallet" className="w-full">
                          <SelectValue placeholder="Select wallet" />
                        </SelectTrigger>
                        <SelectContent>
                          {wallets.map((wallet) => (
                            <SelectItem key={wallet.id} value={wallet.type}>
                              {wallet.name || wallet.type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="amount" className="text-sm font-medium">Amount</label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.00000001"
                        min="0"
                        value={swapAmount}
                        onChange={(e) => setSwapAmount(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleSwapSubmit}>
                      <ArrowLeftRight className="mr-2 h-4 w-4" /> Swap
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Create New Wallet
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Wallet</DialogTitle>
                    <DialogDescription>
                      Choose the cryptocurrency type and name for your new wallet.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4 space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="walletType" className="text-sm font-medium">Wallet Type</label>
                      <Select value={newWalletType} onValueChange={setNewWalletType}>
                        <SelectTrigger id="walletType" className="w-full">
                          <SelectValue placeholder="Select wallet type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                          <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                          <SelectItem value="Tron">Tron (TRX)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="walletName" className="text-sm font-medium">Wallet Name (Optional)</label>
                      <Input
                        id="walletName"
                        placeholder="My Awesome Wallet"
                        value={newWalletName}
                        onChange={(e) => setNewWalletName(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleCreateWallet}>
                      <Wallet className="mr-2 h-4 w-4" /> Create Wallet
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {
            isCheck ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {importedWallets.map((wallet) => (
                  <WalletCard
                    key={wallet.id}
                    wallet={wallet}
                    onDepositClick={handleDepositClick}
                    onWithdrawClick={() => handleWithdrawClick(wallet.type)}
                  />
                ))}
              </div>
            ) : (
              wallets.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <div className="flex flex-col items-center gap-4">
                      <Wallet className="h-12 w-12 text-muted-foreground" />
                      <h3 className="text-xl font-semibold">No wallets found</h3>
                      <p className="text-muted-foreground">
                        You don't have any wallets yet. Create your first wallet to get started.
                      </p>
                      <Button onClick={() => setIsCreateOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Create Wallet
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {wallets.map((wallet) => (
                    <WalletCard
                      key={wallet.id}
                      wallet={wallet}
                      onDepositClick={handleDepositClick}
                      onWithdrawClick={() => handleWithdrawClick(wallet.type)}
                    />
                  ))}
                </div>
              )
            )
          }

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

export default Wallets;
