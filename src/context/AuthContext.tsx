
import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userToken: User) => Promise<void>;
  register: (userToken: User) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for saved user session in localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse saved user", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (userToken: User) => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      const userData: User = {
        id: userToken.id,
        email: userToken.email,
        username: userToken.username,
        password: userToken.password
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      toast({
        title: "Login Successful",
        description: `Welcome back, ${userData.username}!`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userToken: User) => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      // In a real app, we would save this to a database
      // Here we're just mocking the response
      const newUser: User = {
        id: `user-${Date.now()}`,
        email : userToken.email,
        username : userToken.username,
        password : userToken.password
      };

      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      toast({
        title: "Registration Successful",
        description: "Your account has been created",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You've been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
