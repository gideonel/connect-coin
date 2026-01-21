import { motion } from 'framer-motion';
import { Heart, Crown, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { sampleUsers } from '@/data/sampleUsers';

const LikesReceived = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Generate mock likes data
  const likes = sampleUsers.slice(0, 8).map((u, index) => ({
    id: `like_${index}`,
    fromUser: u,
    likedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    isSuperLike: index < 2,
  }));

  const isPremium = user?.premium?.isActive;

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
              <Heart className="w-5 h-5 text-primary fill-primary" />
              Likes You
            </h1>
            <p className="text-sm text-muted-foreground">{likes.length} people like you</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Premium CTA */}
        {!isPremium && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 mb-6 text-white"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Crown className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">Upgrade to See Who Likes You</h3>
                <p className="text-white/80 text-sm mb-4">
                  Match instantly with people who already like you
                </p>
                <Button 
                  variant="secondary" 
                  className="bg-white text-amber-600 hover:bg-white/90"
                  onClick={() => navigate('/premium')}
                >
                  Get Premium
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Likes grid */}
        <div className="grid grid-cols-2 gap-4">
          {likes.map((like, index) => (
            <motion.div
              key={like.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`relative rounded-2xl overflow-hidden aspect-[3/4] ${
                !isPremium ? 'cursor-pointer group' : ''
              }`}
              onClick={() => !isPremium && navigate('/premium')}
            >
              <img
                src={like.fromUser.photos[0]}
                alt={like.fromUser.name}
                className={`w-full h-full object-cover ${
                  !isPremium ? 'blur-lg' : ''
                }`}
              />
              
              {/* Overlay for non-premium */}
              {!isPremium && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                  <Crown className="w-8 h-8 text-amber-400" />
                </div>
              )}

              {/* Info overlay for premium */}
              {isPremium && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center gap-2">
                    {like.isSuperLike && (
                      <Sparkles className="w-4 h-4 text-blue-400" />
                    )}
                    <span className="font-semibold text-white">{like.fromUser.name}</span>
                    <span className="text-white/80">{like.fromUser.age}</span>
                  </div>
                  <p className="text-white/60 text-sm">{like.fromUser.location}</p>
                </div>
              )}

              {/* Super like badge */}
              {like.isSuperLike && (
                <div className="absolute top-3 right-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Super Like
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LikesReceived;
