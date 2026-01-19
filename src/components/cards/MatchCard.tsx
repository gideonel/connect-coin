import { MessageCircle, Phone, Video, MapPin, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User } from '@/data/sampleUsers';
import { motion } from 'framer-motion';

interface MatchCardProps {
  user: User;
  onMessage: (userId: string) => void;
  onCall: (userId: string) => void;
  onVideoCall: (userId: string) => void;
}

export const MatchCard = ({ user, onMessage, onCall, onVideoCall }: MatchCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="glass-card rounded-xl overflow-hidden"
    >
      <div className="relative">
        <img
          src={user.photos[0]}
          alt={user.name}
          className="w-full h-48 object-cover"
        />
        {user.online && (
          <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-green-500 ring-2 ring-white" />
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
          <div className="flex items-center gap-1.5 text-white">
            <h3 className="font-semibold">
              {user.name}, {user.age}
            </h3>
            {user.verified && (
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
            )}
          </div>
          <div className="flex items-center gap-1 text-white/80 text-xs">
            <MapPin className="w-3 h-3" />
            {user.location}
          </div>
        </div>
      </div>

      <div className="p-3">
        <div className="flex flex-wrap gap-1 mb-3">
          {user.interests.slice(0, 3).map((interest) => (
            <Badge key={interest} variant="secondary" className="text-xs">
              {interest}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="gradient"
            size="sm"
            className="flex-1"
            onClick={() => onMessage(user.id)}
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            Chat
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => onCall(user.id)}
          >
            <Phone className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => onVideoCall(user.id)}
          >
            <Video className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
