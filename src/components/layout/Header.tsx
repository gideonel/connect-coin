import { Heart, MessageCircle, User, Coins, Crown, Menu, X, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { currentUser } from '@/data/sampleUsers';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationCenter } from '@/components/NotificationCenter';
import { ThemeToggle } from '@/components/ThemeToggle';
import { DailyRewards } from '@/components/DailyRewards';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/discover', label: 'Discover', icon: Heart },
    { path: '/messages', label: 'Messages', icon: MessageCircle },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-soft">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-serif text-xl font-semibold hidden sm:block">
              SingleAnd <span className="gradient-text">Soaring</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <Button
                  variant={isActive(link.path) ? 'default' : 'ghost'}
                  className="gap-2"
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Daily Rewards */}
            <DailyRewards />
            
            {/* Notifications */}
            <NotificationCenter />
            
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Token Balance */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary">
              <Coins className="w-4 h-4 text-gold" />
              <span className="font-medium text-sm">{currentUser.tokens}</span>
            </div>

            {/* Premium Badge */}
            <Badge 
              variant="outline" 
              className="hidden sm:flex gap-1 border-gold text-gold bg-gold/10"
            >
              <Crown className="w-3 h-3" />
              {currentUser.premium.charAt(0).toUpperCase() + currentUser.premium.slice(1)}
            </Badge>

            {/* Admin Link */}
            <Link to="/admin" className="hidden lg:block">
              <Button variant="ghost" size="icon">
                <Shield className="w-5 h-5" />
              </Button>
            </Link>

            {/* Profile Avatar */}
            <Link to="/profile">
              <div className="w-9 h-9 rounded-full bg-gradient-primary p-0.5">
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </Link>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 bg-background"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant={isActive(link.path) ? 'default' : 'ghost'}
                    className="w-full justify-start gap-2"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Button>
                </Link>
              ))}
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Shield className="w-4 h-4" />
                  Admin
                </Button>
              </Link>
              <div className="flex items-center gap-2 px-3 py-2 mt-2 rounded-lg bg-secondary">
                <Coins className="w-4 h-4 text-gold" />
                <span className="font-medium">{currentUser.tokens} Tokens</span>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
