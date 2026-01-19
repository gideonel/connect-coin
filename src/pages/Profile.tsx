import { useState } from 'react';
import { 
  User, Camera, MapPin, Heart, Crown, Coins, Edit2, 
  Settings, Shield, Bell, LogOut, ChevronRight, Plus, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Header } from '@/components/layout/Header';
import { PremiumCard } from '@/components/cards/PremiumCard';
import { currentUser, premiumPlans, tokenPackages } from '@/data/sampleUsers';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const Profile = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'tokens' | 'premium'>('profile');

  const profileCompletion = 75;

  const menuItems = [
    { icon: Settings, label: 'Settings', onClick: () => toast.info('Settings coming soon') },
    { icon: Shield, label: 'Privacy & Safety', onClick: () => toast.info('Privacy settings coming soon') },
    { icon: Bell, label: 'Notifications', onClick: () => toast.info('Notification settings coming soon') },
    { icon: LogOut, label: 'Log Out', onClick: () => toast.info('Logout coming soon'), danger: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-3xl overflow-hidden mb-6"
          >
            {/* Cover */}
            <div className="h-32 bg-gradient-to-r from-rose to-coral relative">
              <Button
                variant="glass"
                size="sm"
                className="absolute top-4 right-4"
              >
                <Camera className="w-4 h-4 mr-1" />
                Edit Cover
              </Button>
            </div>

            {/* Profile Info */}
            <div className="px-6 pb-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16 sm:-mt-12">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-rose to-coral p-1">
                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                      <User className="w-12 h-12 text-muted-foreground" />
                    </div>
                  </div>
                  <Button
                    variant="default"
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full h-10 w-10"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <h1 className="font-serif text-2xl font-bold">{currentUser.name}, {currentUser.age}</h1>
                    <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white border-0 gap-1">
                      <Crown className="w-3 h-3" />
                      Gold
                    </Badge>
                  </div>
                  <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-1">
                    <MapPin className="w-4 h-4" />
                    New York, NY
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" className="gap-2">
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </Button>
                </div>
              </div>

              {/* Profile Completion */}
              <div className="mt-6 p-4 rounded-xl bg-secondary/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Profile Completion</span>
                  <span className="text-sm text-muted-foreground">{profileCompletion}%</span>
                </div>
                <Progress value={profileCompletion} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  Complete your profile to get 50% more matches!
                </p>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {[
              { id: 'profile', label: 'My Profile', icon: User },
              { id: 'tokens', label: 'Token Wallet', icon: Coins },
              { id: 'premium', label: 'Premium', icon: Crown },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'outline'}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className="gap-2 flex-shrink-0"
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'profile' && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Stats Card */}
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="font-serif text-xl font-semibold mb-4">Your Stats</h2>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-xl bg-secondary/50">
                      <Heart className="w-6 h-6 text-rose mx-auto mb-2" />
                      <div className="text-2xl font-bold">{currentUser.likes}</div>
                      <div className="text-xs text-muted-foreground">Likes You</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-secondary/50">
                      <Sparkles className="w-6 h-6 text-gold mx-auto mb-2" />
                      <div className="text-2xl font-bold">{currentUser.matches}</div>
                      <div className="text-xs text-muted-foreground">Matches</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-secondary/50">
                      <User className="w-6 h-6 text-coral mx-auto mb-2" />
                      <div className="text-2xl font-bold">{currentUser.profileViews}</div>
                      <div className="text-xs text-muted-foreground">Views</div>
                    </div>
                  </div>
                </div>

                {/* Menu */}
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="font-serif text-xl font-semibold mb-4">Quick Actions</h2>
                  <div className="space-y-1">
                    {menuItems.map((item) => (
                      <button
                        key={item.label}
                        onClick={item.onClick}
                        className={`w-full flex items-center justify-between p-3 rounded-xl hover:bg-secondary transition-colors ${
                          item.danger ? 'text-destructive hover:bg-destructive/10' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tokens' && (
              <div className="space-y-6">
                {/* Token Balance */}
                <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-gold/10 to-amber-500/5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="font-serif text-xl font-semibold">Token Balance</h2>
                      <p className="text-sm text-muted-foreground">Use tokens for messages, calls, and more</p>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 flex items-center justify-center">
                      <Coins className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="text-5xl font-bold mb-2">{currentUser.tokens}</div>
                  <p className="text-sm text-muted-foreground">
                    Gold members get 25% bonus on all purchases!
                  </p>
                </div>

                {/* Token Packages */}
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="font-serif text-xl font-semibold mb-4">Buy Tokens</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {tokenPackages.map((pkg) => (
                      <motion.button
                        key={pkg.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toast.success('Payment coming soon!')}
                        className="p-4 rounded-xl border-2 border-border hover:border-gold transition-colors text-left"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Coins className="w-5 h-5 text-gold" />
                            <span className="font-bold text-lg">{pkg.tokens}</span>
                          </div>
                          {pkg.bonus > 0 && (
                            <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                              +{pkg.bonus} bonus
                            </Badge>
                          )}
                        </div>
                        <div className="text-2xl font-bold">${pkg.price}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          ${(pkg.price / (pkg.tokens + pkg.bonus)).toFixed(3)} per token
                        </p>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Token Pricing */}
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="font-serif text-xl font-semibold mb-4">Token Usage</h2>
                  <div className="space-y-3">
                    {[
                      { action: 'Send a message', cost: 5 },
                      { action: 'Voice call (per min)', cost: 10 },
                      { action: 'Video call (per min)', cost: 20 },
                      { action: 'Send a photo', cost: 8 },
                      { action: 'Super Like', cost: 15 },
                    ].map((item) => (
                      <div key={item.action} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                        <span>{item.action}</span>
                        <div className="flex items-center gap-1">
                          <Coins className="w-4 h-4 text-gold" />
                          <span className="font-semibold">{item.cost}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'premium' && (
              <div className="space-y-6">
                {/* Current Plan */}
                <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-amber-400/10 to-amber-600/5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 flex items-center justify-center">
                      <Crown className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white border-0 mb-1">
                        Current Plan
                      </Badge>
                      <h2 className="font-serif text-2xl font-bold">Gold Member</h2>
                      <p className="text-sm text-muted-foreground">Renews on March 15, 2024</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Manage Subscription
                  </Button>
                </div>

                {/* Premium Plans */}
                <div>
                  <h2 className="font-serif text-xl font-semibold mb-4">Upgrade Your Experience</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {premiumPlans.map((plan) => (
                      <PremiumCard
                        key={plan.id}
                        plan={plan}
                        onSelect={(id) => toast.success(`Selected ${id} plan!`)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Profile;