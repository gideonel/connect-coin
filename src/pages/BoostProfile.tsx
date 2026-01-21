import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowLeft, Clock, TrendingUp, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const BOOST_OPTIONS = [
  { duration: 30, cost: 5, multiplier: '3x', popular: false },
  { duration: 60, cost: 8, multiplier: '5x', popular: true },
  { duration: 180, cost: 20, multiplier: '10x', popular: false },
];

const BoostProfile = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [selectedBoost, setSelectedBoost] = useState(1);
  const [isActivating, setIsActivating] = useState(false);

  const isCurrentlyBoosted = user?.boostedUntil && new Date(user.boostedUntil) > new Date();
  const boostTimeRemaining = isCurrentlyBoosted 
    ? Math.ceil((new Date(user!.boostedUntil!).getTime() - Date.now()) / 1000 / 60)
    : 0;

  const handleActivateBoost = async () => {
    const boost = BOOST_OPTIONS[selectedBoost];
    
    if ((user?.tokens || 0) < boost.cost) {
      toast.error('Not enough tokens. Purchase more tokens to boost.');
      navigate('/premium');
      return;
    }

    setIsActivating(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const boostEndTime = new Date(Date.now() + boost.duration * 60 * 1000);
    updateProfile({
      tokens: (user?.tokens || 0) - boost.cost,
      boostedUntil: boostEndTime.toISOString(),
    });

    toast.success(`Boost activated! Your profile is now ${boost.multiplier} more visible for ${boost.duration} minutes`);
    setIsActivating(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-background/80 backdrop-blur-lg border-b z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Boost Your Profile
            </h1>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-muted-foreground">Tokens:</span>
            <span className="font-bold text-primary">{user?.tokens || 0}</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Currently boosted banner */}
        {isCurrentlyBoosted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 mb-6 text-white"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                <Zap className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Boost Active!</h3>
                <p className="text-white/80">
                  {boostTimeRemaining} minutes remaining
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 mb-4">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Get More Matches</h2>
          <p className="text-muted-foreground">
            Boosting puts your profile at the top of the deck so more people can discover you
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'More Views', value: '10x', icon: TrendingUp },
            { label: 'More Likes', value: '5x', icon: '❤️' },
            { label: 'More Matches', value: '3x', icon: '✨' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-xl p-4 text-center border"
            >
              <div className="text-2xl mb-1">
                {typeof stat.icon === 'string' ? stat.icon : <stat.icon className="w-6 h-6 mx-auto text-primary" />}
              </div>
              <div className="font-bold text-lg">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Boost options */}
        <div className="space-y-3 mb-8">
          {BOOST_OPTIONS.map((option, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedBoost(index)}
              className={`w-full p-4 rounded-xl border-2 transition-all ${
                selectedBoost === index
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  selectedBoost === index ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{option.duration} Minutes</span>
                    {option.popular && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                        Most Popular
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {option.multiplier} visibility boost
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-lg">{option.cost}</span>
                  <span className="text-muted-foreground text-sm"> tokens</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Activate button */}
        <Button 
          onClick={handleActivateBoost}
          className="w-full h-14 text-lg"
          disabled={isActivating || isCurrentlyBoosted}
        >
          {isActivating ? (
            'Activating...'
          ) : isCurrentlyBoosted ? (
            'Boost Already Active'
          ) : (
            <>
              <Zap className="w-5 h-5 mr-2" />
              Activate Boost ({BOOST_OPTIONS[selectedBoost].cost} tokens)
            </>
          )}
        </Button>

        {/* Premium note */}
        <p className="text-center text-sm text-muted-foreground mt-4">
          <Crown className="w-4 h-4 inline mr-1 text-amber-500" />
          Premium members get 1 free boost per week
        </p>
      </main>
    </div>
  );
};

export default BoostProfile;
