"use client";
import { useEffect, useState } from "react";
import { Activity, Bell, Settings, Wifi, WifiOff } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Check initial state
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <nav className="h-16 border-b border-border bg-card flex items-center justify-between px-4 md:px-6 shrink-0 safe-top">
      <div className="flex items-center gap-2">
        <Activity className="h-6 w-6 text-primary" />
        <span className="text-lg font-semibold tracking-tight text-foreground hidden sm:inline-block">
          MedNexus
        </span>
      </div>
      
      <div className="flex items-center gap-3 md:gap-4">
        {/* Offline Indicator */}
        <div 
          className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium transition-colors",
            isOnline ? "bg-safe/10 text-safe" : "bg-destructive/10 text-destructive"
          )}
          title={isOnline ? "Online" : "Offline - Showing cached clinical data"}
        >
          {isOnline ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
          <span className="hidden sm:inline-block">{isOnline ? "Online" : "Offline"}</span>
        </div>

        <button className="text-muted-foreground hover:text-foreground transition-colors p-2" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </button>
        <button className="text-muted-foreground hover:text-foreground transition-colors p-2 hidden sm:block" aria-label="Settings">
          <Settings className="h-5 w-5" />
        </button>
        <div className="h-8 w-px bg-border mx-1 md:mx-2" />
        <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-transparent hover:ring-primary transition-all">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>DR</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
}
