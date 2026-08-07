"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FilePlus, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Patients", href: "/patients/PT-1029", icon: Users },
  { name: "Intake", href: "/intake", icon: FilePlus },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-16 lg:w-64 border-r border-border bg-card flex flex-col items-center lg:items-stretch py-6 shrink-0 transition-all duration-300">
      <div className="flex flex-col gap-2 px-2 lg:px-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 p-3 lg:px-4 rounded-md transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
              title={item.name}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="hidden lg:block font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
