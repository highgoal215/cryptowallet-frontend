import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Token {
  id: string;
  rank: number;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
}

const Marketplace: React.FC = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [filteredTokens, setFilteredTokens] = useState<Token[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call to get token data
    const fetchTokens = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockTokens: Token[] = [
        { id: 'btc', rank: 1, name: 'Bitcoin', symbol: 'BTC', price: 55000, change24h: 2.5, marketCap: 1050000000000, volume24h: 32000000000 },
        { id: 'eth', rank: 2, name: 'Ethereum', symbol: 'ETH', price: 3200, change24h: 1.8, marketCap: 380000000000, volume24h: 18000000000 },
        { id: 'usdt', rank: 3, name: 'Tether', symbol: 'USDT', price: 1, change24h: 0.01, marketCap: 82000000000, volume24h: 64000000000 },
        { id: 'bnb', rank: 4, name: 'Binance Coin', symbol: 'BNB', price: 350, change24h: -0.9, marketCap: 57000000000, volume24h: 1200000000 },
        { id: 'sol', rank: 5, name: 'Solana', symbol: 'SOL', price: 120, change24h: 5.2, marketCap: 48000000000, volume24h: 3600000000 },
        { id: 'ada', rank: 6, name: 'Cardano', symbol: 'ADA', price: 0.55, change24h: -1.2, marketCap: 19500000000, volume24h: 800000000 },
        { id: 'xrp', rank: 7, name: 'XRP', symbol: 'XRP', price: 0.48, change24h: 0.5, marketCap: 25000000000, volume24h: 1100000000 },
        { id: 'doge', rank: 8, name: 'Dogecoin', symbol: 'DOGE', price: 0.08, change24h: 1.7, marketCap: 11000000000, volume24h: 700000000 },
        { id: 'avax', rank: 9, name: 'Avalanche', symbol: 'AVAX', price: 28, change24h: 3.1, marketCap: 10000000000, volume24h: 600000000 },
        { id: 'dot', rank: 10, name: 'Polkadot', symbol: 'DOT', price: 8.2, change24h: -0.8, marketCap: 9500000000, volume24h: 400000000 },
      ];
      
      setTokens(mockTokens);
      setFilteredTokens(mockTokens);
      setIsLoading(false);
    };
    
    fetchTokens();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredTokens(tokens);
    } else {
      const filtered = tokens.filter(token => 
        token.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTokens(filtered);
    }
  }, [searchTerm, tokens]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: value < 1 ? 4 : 2,
      maximumFractionDigits: value < 1 ? 4 : 2,
    }).format(value);
  };

  const formatLargeNumber = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return formatCurrency(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <Navbar />
      
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Token Marketplace</h1>
              <p className="text-muted-foreground">Explore and track cryptocurrency prices</p>
            </div>
            <div className="w-full md:w-80">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tokens..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Cryptocurrency Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4 px-2">#</th>
                      <th className="text-left py-4 px-2">Name</th>
                      <th className="text-right py-4 px-2">Price</th>
                      <th className="text-right py-4 px-2">24h %</th>
                      <th className="text-right py-4 px-2">Market Cap</th>
                      <th className="text-right py-4 px-2">Volume (24h)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      Array(10).fill(0).map((_, index) => (
                        <tr key={`skeleton-${index}`} className="border-b">
                          <td className="py-4 px-2"><Skeleton className="h-5 w-6" /></td>
                          <td className="py-4 px-2"><Skeleton className="h-5 w-32" /></td>
                          <td className="py-4 px-2 text-right"><Skeleton className="h-5 w-24 ml-auto" /></td>
                          <td className="py-4 px-2 text-right"><Skeleton className="h-5 w-16 ml-auto" /></td>
                          <td className="py-4 px-2 text-right"><Skeleton className="h-5 w-24 ml-auto" /></td>
                          <td className="py-4 px-2 text-right"><Skeleton className="h-5 w-24 ml-auto" /></td>
                        </tr>
                      ))
                    ) : (
                      filteredTokens.map((token) => (
                        <tr key={token.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="py-4 px-2">{token.rank}</td>
                          <td className="py-4 px-2">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                                {token.symbol.charAt(0)}
                              </div>
                              <span className="font-medium">{token.name}</span>
                              <Badge variant="outline" className="ml-2">{token.symbol}</Badge>
                            </div>
                          </td>
                          <td className="py-4 px-2 text-right">{formatCurrency(token.price)}</td>
                          <td className={`py-4 px-2 text-right ${token.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                          </td>
                          <td className="py-4 px-2 text-right">{formatLargeNumber(token.marketCap)}</td>
                          <td className="py-4 px-2 text-right">{formatLargeNumber(token.volume24h)}</td>
                        </tr>
                      ))
                    )}

                    {!isLoading && filteredTokens.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-muted-foreground">
                          No tokens found matching your search criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
