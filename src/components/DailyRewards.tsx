import { useState } from 'react';
import { Gift, X, Coins, Zap, Star, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { mockDailyRewards } from '@/data/gamificationData';
import { toast } from 'sonner';

export function DailyRewards() {
  const [isOpen, setIsOpen] = useState(false);
  const [rewards, setRewards] = useState(mockDailyRewards);
  const [currentDay] = useState(4); // Current streak day

  const claimReward = (day: number) => {
    if (day !== currentDay) return;
    
    setRewards(rewards.map(r => 
      r.day === day ? { ...r, claimed: true } : r
    ));
    
    const reward = rewards.find(r => r.day === day);
    toast.success(`Claimed ${reward?.amount} ${reward?.reward}!`, {
      icon: '🎁',
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'tokens': return <Coins className="w-5 h-5 text-gold" />;
      case 'coins': return <Coins className="w-5 h-5 text-amber-600" />;
      case 'boost': return <Zap className="w-5 h-5 text-purple-500" />;
      case 'superlike': return <Star className="w-5 h-5 text-blue-500" />;
      default: return <Gift className="w-5 h-5" />;
    }
  };

  const hasUnclaimedReward = rewards.some(r => r.day === currentDay && !r.claimed);

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative"
        onClick={() => setIsOpen(true)}
      >
        <Gift className="w-5 h-5" />
        {hasUnclaimedReward && (
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 animate-pulse" />
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-3xl p-6 max-w-md w-full shadow-elevated"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold">Daily Rewards</h2>
                  <p className="text-muted-foreground">Day {currentDay} streak 🔥</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {rewards.map((reward) => {
                  const isCurrentDay = reward.day === currentDay;
                  const isPast = reward.day < currentDay;
                  const isFuture = reward.day > currentDay;

                  return (
                    <motion.button
                      key={reward.day}
                      whileHover={isCurrentDay && !reward.claimed ? { scale: 1.05 } : {}}
                      whileTap={isCurrentDay && !reward.claimed ? { scale: 0.95 } : {}}
                      className={`relative flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${
                        isCurrentDay && !reward.claimed
                          ? 'border-primary bg-primary/10 cursor-pointer'
                          : reward.claimed
                          ? 'border-green-500 bg-green-500/10'
                          : isFuture
                          ? 'border-border bg-secondary/50 opacity-50'
                          : 'border-border bg-secondary'
                      }`}
                      onClick={() => claimReward(reward.day)}
                      disabled={!isCurrentDay || reward.claimed}
                    >
                      <span className="text-xs font-medium text-muted-foreground mb-1">
                        Day {reward.day}
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center mb-1">
                        {reward.claimed ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          getIcon(reward.type)
                        )}
                      </div>
                      <span className="text-xs font-bold">
                        {reward.amount}
                      </span>
                      
                      {isCurrentDay && !reward.claimed && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center"
                        >
                          <span className="text-[10px] text-primary-foreground">!</span>
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-gold/20 to-amber-500/20 rounded-xl">
                <p className="text-sm text-center">
                  <span className="font-semibold">Week 2 Bonus:</span> Complete all 7 days for 
                  <span className="text-gold font-bold"> 100 bonus tokens!</span>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
