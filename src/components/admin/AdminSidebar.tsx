import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  Coins, 
  CreditCard, 
  BarChart3, 
  Settings,
  Heart,
  ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/admin' },
  { icon: Users, label: 'User Management', path: '/admin/users' },
  { icon: Shield, label: 'Content Moderation', path: '/admin/moderation' },
  { icon: Coins, label: 'Token Settings', path: '/admin/tokens' },
  { icon: CreditCard, label: 'Subscriptions', path: '/admin/subscriptions' },
  { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

export function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen p-4 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose to-coral flex items-center justify-center">
          <Heart className="w-5 h-5 text-white fill-white" />
        </div>
        <div>
          <h1 className="font-serif text-lg font-bold text-foreground">Admin Panel</h1>
          <p className="text-xs text-muted-foreground">SingleAnd Soaring</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== '/admin' && location.pathname.startsWith(item.path));
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Back to App */}
      <Link
        to="/"
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all mt-4"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to App
      </Link>
    </aside>
  );
}
