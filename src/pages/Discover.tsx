import { useState, useCallback } from 'react';
import { Heart, Filter, MapPin, Sliders, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProfileCard } from '@/components/cards/ProfileCard';
import { Header } from '@/components/layout/Header';
import { sampleUsers, currentUser } from '@/data/sampleUsers';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { FilterPanel, FilterState } from '@/components/FilterPanel';
import { CompatibilityScore } from '@/components/CompatibilityScore';

const Discover = () => {
  const [users, setUsers] = useState(sampleUsers);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedUser, setMatchedUser] = useState<typeof sampleUsers[0] | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState | null>(null);

  const currentProfile = users[currentIndex];

  // Generate random compatibility score for demo
  const compatibilityScore = Math.floor(Math.random() * 30) + 70;

  const handleLike = useCallback((userId: string) => {
    const user = users.find(u => u.id === userId);
    
    // Simulate a match 30% of the time
    if (Math.random() > 0.7 && user) {
      setMatchedUser(user);
      setShowMatch(true);
    } else {
      toast.success(`You liked ${user?.name}!`, {
        icon: <Heart className="w-4 h-4 text-rose fill-rose" />,
      });
    }

    setCurrentIndex(prev => prev + 1);
  }, [users]);

  const handleDislike = useCallback((userId: string) => {
    setCurrentIndex(prev => prev + 1);
  }, []);

  const handleSuperLike = useCallback((userId: string) => {
    const user = users.find(u => u.id === userId);
    toast.success(`You super liked ${user?.name}!`, {
      icon: '⭐',
      description: 'They will see your profile first!',
    });
    setCurrentIndex(prev => prev + 1);
  }, [users]);

  const closeMatchModal = () => {
    setShowMatch(false);
    setMatchedUser(null);
  };

  const handleApplyFilters = (filters: FilterState) => {
    setActiveFilters(filters);
    toast.success('Filters applied!');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-serif text-2xl font-bold">Discover</h1>
              <p className="text-sm text-muted-foreground">Find your perfect match</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <MapPin className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setShowFilters(true)}>
                <Sliders className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Active filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="secondary" className="gap-1">
              <Filter className="w-3 h-3" />
              {activeFilters?.gender.join(', ') || 'Women'}
            </Badge>
            <Badge variant="secondary">
              {activeFilters ? `${activeFilters.ageRange[0]}-${activeFilters.ageRange[1]}` : '25-35'} years
            </Badge>
            <Badge variant="secondary">
              Within {activeFilters?.distance || 25} miles
            </Badge>
          </div>

          {/* Compatibility Score for current profile */}
          {currentProfile && currentIndex < users.length && (
            <div className="mb-4 p-4 bg-card rounded-xl border border-border">
              <CompatibilityScore score={compatibilityScore} />
            </div>
          )}

          {/* Cards Stack */}
          <div className="relative h-[550px] flex items-center justify-center">
            {currentIndex < users.length ? (
              <>
                {/* Background cards for stack effect */}
                {users.slice(currentIndex + 1, currentIndex + 3).map((user, idx) => (
                  <div
                    key={user.id}
                    className="absolute w-full max-w-sm mx-auto"
                    style={{
                      transform: `scale(${1 - (idx + 1) * 0.05}) translateY(${(idx + 1) * 12}px)`,
                      zIndex: -idx - 1,
                      opacity: 1 - (idx + 1) * 0.2,
                    }}
                  >
                    <div className="rounded-2xl overflow-hidden shadow-card bg-card">
                      <div className="aspect-[3/4] bg-secondary" />
                    </div>
                  </div>
                ))}

                {/* Active card */}
                <AnimatePresence mode="wait">
                  <ProfileCard
                    key={currentProfile.id}
                    user={currentProfile}
                    onLike={handleLike}
                    onDislike={handleDislike}
                    onSuperLike={handleSuperLike}
                  />
                </AnimatePresence>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-8"
              >
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-10 h-10 text-muted-foreground" />
                </div>
                <h2 className="font-serif text-2xl font-semibold mb-2">
                  No more profiles
                </h2>
                <p className="text-muted-foreground mb-6">
                  You've seen everyone nearby. Check back later for new matches!
                </p>
                <Button 
                  variant="gradient" 
                  onClick={() => setCurrentIndex(0)}
                >
                  Start Over
                </Button>
              </motion.div>
            )}
          </div>

          {/* Stats bar */}
          <div className="glass-card rounded-2xl p-4 mt-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-rose">{currentUser.likes}</div>
                <div className="text-xs text-muted-foreground">Likes You</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gold">{currentUser.matches}</div>
                <div className="text-xs text-muted-foreground">Matches</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-coral">{currentUser.profileViews}</div>
                <div className="text-xs text-muted-foreground">Profile Views</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Filter Panel */}
      <FilterPanel 
        isOpen={showFilters} 
        onClose={() => setShowFilters(false)} 
        onApply={handleApplyFilters}
      />

      {/* Match Modal */}
      <AnimatePresence>
        {showMatch && matchedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={closeMatchModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-card rounded-3xl p-8 max-w-sm w-full text-center shadow-elevated"
              onClick={e => e.stopPropagation()}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <div className="relative w-32 h-32 mx-auto">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-rose to-coral p-1">
                    <img
                      src={matchedUser.photos[0]}
                      alt={matchedUser.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-2 rounded-full border-2 border-dashed border-rose/30"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="font-serif text-3xl font-bold mb-2">
                  It's a <span className="gradient-text">Match!</span>
                </h2>
                <p className="text-muted-foreground mb-4">
                  You and {matchedUser.name} liked each other
                </p>
                
                {/* Show compatibility */}
                <div className="mb-6 flex justify-center">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-coral/10 rounded-full">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{compatibilityScore}% Compatible</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="gradient" 
                    className="flex-1"
                    onClick={closeMatchModal}
                  >
                    Send Message
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={closeMatchModal}
                  >
                    Keep Swiping
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Discover;