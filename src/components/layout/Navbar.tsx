
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, User, Wallet, CreditCard, BarChart3, History } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AnimatedContent from '@/animation/AnimatedContent/AnimatedContent';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();

  if (!user) return null; // Don't render navbar if not logged in

  const navItems = [
    { name: "Dashboard", path: "/", icon: <BarChart3 className="mr-2 h-4 w-4" /> },
    { name: "Profile", path: "/profile", icon: <User className="mr-2 h-4 w-4" /> },
    { name: "My Wallets", path: "/wallets", icon: <Wallet className="mr-2 h-4 w-4" /> },
    { name: "Transactions", path: "/transactions", icon: <History className="mr-2 h-4 w-4" /> },
    { name: "Marketplace", path: "/marketplace", icon: <CreditCard className="mr-2 h-4 w-4" /> }
  ];

  return (
    <AnimatedContent
      distance={50}
      direction="vertical"
      reverse={true}
      config={{ tension: 45, friction: 20 }}
      initialOpacity={0.0}
      animateOpacity
      scale={1.0}
      threshold={0.2}
    >
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-bold gradient-text">FlowLux</h1>
            </Link>

            {!isMobile && (
              <NavigationMenu>
                <NavigationMenuList>
                  {navItems.map((item) => (
                    <NavigationMenuItem key={item.path}>
                      <Link to={item.path}>
                        <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                          {item.name}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:block text-sm text-muted-foreground">
              {user.username}
            </span>

            {isMobile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {navItems.map((item) => (
                    <DropdownMenuItem key={item.path} asChild>
                      <Link to={item.path} className="flex items-center">
                        {item.icon}
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>
    </AnimatedContent>
  );
};

export default Navbar;
