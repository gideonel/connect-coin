import { Heart, X, Star, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User } from '@/data/sampleUsers';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { useState } from 'react';

interface ProfileCardProps {
  user: User;
  onLike: (userId: string) => void;
  onDislike: (userId: string) => void;
  onSuperLike: (userId: string) => void;
}

export const ProfileCard = ({ user, onLike, onDislike, onSuperLike }: ProfileCardProps) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [exitX, setExitX] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      setExitX(300);
      setIsExiting(true);
      setTimeout(() => onLike(user.id), 200);
    } else if (info.offset.x < -100) {
      setExitX(-300);
      setIsExiting(true);
      setTimeout(() => onDislike(user.id), 200);
    }
  };

  const handleLike = () => {
    setExitX(300);
    setIsExiting(true);
    setTimeout(() => onLike(user.id), 200);
  };

  const handleDislike = () => {
    setExitX(-300);
    setIsExiting(true);
    setTimeout(() => onDislike(user.id), 200);
  };

  const premiumColors = {
    free: 'bg-secondary text-secondary-foreground',
    silver: 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800',
    gold: 'bg-gradient-to-r from-amber-400 to-amber-500 text-white',
    platinum: 'bg-gradient-to-r from-purple-400 to-pink-500 text-white',
  };

  return (
    <motion.div
      className="absolute w-full max-w-sm mx-auto"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={isExiting ? { x: exitX, opacity: 0 } : {}}
      transition={{ duration: 0.2 }}
    >
      <div className="relative rounded-2xl overflow-hidden shadow-elevated bg-card">
        {/* Photo */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={user.photos[currentPhotoIndex]}
            alt={user.name}
            className="w-full h-full object-cover"
          />
          
          {/* Photo indicators */}
          {user.photos.length > 1 && (
            <div className="absolute top-3 left-3 right-3 flex gap-1">
              {user.photos.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded-full transition-all ${
                    index === currentPhotoIndex 
                      ? 'bg-white' 
                      : 'bg-white/40'
                  }`}
                  onClick={() => setCurrentPhotoIndex(index)}
                />
              ))}
            </div>
          )}

          {/* Like/Nope overlays */}
          <motion.div
            className="absolute top-8 right-8 px-4 py-2 border-4 border-green-500 rounded-lg"
            style={{ opacity: likeOpacity }}
          >
            <span className="text-green-500 font-bold text-2xl">LIKE</span>
          </motion.div>
          <motion.div
            className="absolute top-8 left-8 px-4 py-2 border-4 border-red-500 rounded-lg"
            style={{ opacity: nopeOpacity }}
          >
            <span className="text-red-500 font-bold text-2xl">NOPE</span>
          </motion.div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Online indicator */}
          {user.online && (
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/90 text-white text-xs">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Online
            </div>
          )}

          {/* User info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-serif font-semibold">
                {user.name}, {user.age}
              </h2>
              {user.verified && (
                <CheckCircle2 className="w-5 h-5 text-blue-400 fill-blue-400/20" />
              )}
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
              <MapPin className="w-4 h-4" />
              {user.location} • {user.height}
            </div>
            <p className="text-sm text-white/90 line-clamp-2 mb-3">
              {user.bio}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {user.interests.slice(0, 4).map((interest) => (
                <Badge 
                  key={interest} 
                  variant="outline" 
                  className="bg-white/10 border-white/20 text-white text-xs"
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Premium badge */}
        {user.premium !== 'free' && (
          <div className="absolute top-4 left-4">
            <Badge className={`${premiumColors[user.premium]} gap-1`}>
              <Sparkles className="w-3 h-3" />
              {user.premium.charAt(0).toUpperCase() + user.premium.slice(1)}
            </Badge>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-4 p-4 bg-card">
          <Button
            variant="outline"
            size="icon-lg"
            className="border-2 border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
            onClick={handleDislike}
          >
            <X className="w-6 h-6" />
          </Button>
          <Button
            variant="gold"
            size="icon-lg"
            onClick={() => onSuperLike(user.id)}
          >
            <Star className="w-6 h-6 fill-current" />
          </Button>
          <Button
            variant="gradient"
            size="icon-lg"
            onClick={handleLike}
          >
            <Heart className="w-6 h-6 fill-current" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
