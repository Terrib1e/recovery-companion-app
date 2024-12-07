import React from 'react';
import { 
  Home,
  Calendar,
  BarChart2,
  BookHeart,
  Settings,
  Phone,
  HeartPulse
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ 
  href, 
  icon, 
  children, 
  active 
}) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-2",
        active && "bg-muted"
      )}
      asChild
    >
      <a href={href}>
        {icon}
        <span>{children}</span>
      </a>
    </Button>
  );
};

const Sidebar: React.FC = () => {
  // In a full implementation, we'd get the current path from a router
  const currentPath = window.location.pathname;

  return (
    <div className="hidden md:flex h-screen w-60 flex-col border-r bg-card px-2">
      <div className="flex-1 space-y-1 py-4">
        <SidebarLink 
          href="/" 
          icon={<Home className="h-5 w-5" />}
          active={currentPath === '/'}
        >
          Dashboard
        </SidebarLink>
        
        <SidebarLink 
          href="/check-in" 
          icon={<HeartPulse className="h-5 w-5" />}
          active={currentPath === '/check-in'}
        >
          Daily Check-in
        </SidebarLink>
        
        <SidebarLink 
          href="/progress" 
          icon={<BarChart2 className="h-5 w-5" />}
          active={currentPath === '/progress'}
        >
          Progress
        </SidebarLink>
        
        <SidebarLink 
          href="/journal" 
          icon={<BookHeart className="h-5 w-5" />}
          active={currentPath === '/journal'}
        >
          Journal
        </SidebarLink>
        
        <SidebarLink 
          href="/appointments" 
          icon={<Calendar className="h-5 w-5" />}
          active={currentPath === '/appointments'}
        >
          Appointments
        </SidebarLink>
      </div>

      <div className="border-t py-4 space-y-1">
        <SidebarLink 
          href="/emergency" 
          icon={<Phone className="h-5 w-5 text-red-500" />}
          active={currentPath === '/emergency'}
        >
          Emergency Contact
        </SidebarLink>
        
        <SidebarLink 
          href="/settings" 
          icon={<Settings className="h-5 w-5" />}
          active={currentPath === '/settings'}
        >
          Settings
        </SidebarLink>
      </div>
    </div>
  );
};

export default Sidebar;