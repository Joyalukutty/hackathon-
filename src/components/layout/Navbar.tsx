import Link from "next/link";
import { Activity, Bell, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  return (
    <nav className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-2">
        <Activity className="h-6 w-6 text-primary" />
        <span className="text-lg font-semibold tracking-tight text-foreground">
          MedNexus
        </span>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="h-5 w-5" />
        </button>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <Settings className="h-5 w-5" />
        </button>
        <div className="h-8 w-px bg-border mx-2" />
        <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-transparent hover:ring-primary transition-all">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>DR</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
}
