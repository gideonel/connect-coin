import { useState } from 'react';
import { Bell, X, Heart, MessageCircle, Crown, Gift, Coins, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: string;
  type: 'match' | 'message' | 'like' | 'reward' | 'premium' | 'system';
  title: string;
  description: string;
  time: string;
  read: boolean;
  avatar?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'match',
    title: "It's a Match!",
    description: 'You and Sophia liked each other',
    time: '2 min ago',
    read: false,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  },
  {
    id: '2',
    type: 'message',
    title: 'New Message',
    description: 'Emma: Would love to grab coffee!',
    time: '15 min ago',
    read: false,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
  },
  {
    id: '3',
    type: 'like',
    title: 'Someone Likes You',
    description: 'Upgrade to see who liked you',
    time: '1 hour ago',
    read: true,
  },
  {
    id: '4',
    type: 'reward',
    title: 'Daily Reward Ready!',
    description: 'Claim your 25 tokens now',
    time: '3 hours ago',
    read: true,
  },
  {
    id: '5',
    type: 'premium',
    title: 'Special Offer',
    description: '50% off Platinum for 24 hours',
    time: '5 hours ago',
    read: true,
  },
];

const getIcon = (type: Notification['type']) => {
  switch (type) {
    case 'match': return <Heart className="w-5 h-5 text-rose fill-rose" />;
    case 'message': return <MessageCircle className="w-5 h-5 text-blue-500" />;
    case 'like': return <Heart className="w-5 h-5 text-coral" />;
    case 'reward': return <Gift className="w-5 h-5 text-gold" />;
    case 'premium': return <Crown className="w-5 h-5 text-amber-500" />;
    default: return <Bell className="w-5 h-5 text-muted-foreground" />;
  }
};

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-rose to-coral text-white text-xs flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Notification Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-12 w-80 sm:w-96 bg-card rounded-2xl shadow-elevated border border-border z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={markAllRead}>
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Mark all read
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`p-4 flex items-start gap-3 hover:bg-secondary/50 transition-colors cursor-pointer border-b border-border/50 last:border-0 ${
                        !notification.read ? 'bg-primary/5' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      {notification.avatar ? (
                        <img 
                          src={notification.avatar} 
                          alt="" 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                          {getIcon(notification.type)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm text-foreground">{notification.title}</p>
                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{notification.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No notifications yet</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-border bg-secondary/30">
                <Button variant="ghost" className="w-full text-sm">
                  View All Notifications
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
