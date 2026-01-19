import { Trophy, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { mockAchievements, Achievement } from '@/data/gamificationData';
import { Progress } from '@/components/ui/progress';

interface AchievementCardProps {
  achievement: Achievement;
}

function AchievementCard({ achievement }: AchievementCardProps) {
  const rarityColors = {
    common: 'from-gray-400 to-gray-500',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-amber-400 to-orange-500',
  };

  const rarityBorder = {
    common: 'border-gray-300',
    rare: 'border-blue-400',
    epic: 'border-purple-400',
    legendary: 'border-amber-400',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`relative p-4 rounded-xl border-2 ${
        achievement.unlocked ? rarityBorder[achievement.rarity] : 'border-border'
      } ${achievement.unlocked ? 'bg-card' : 'bg-secondary/50'} transition-all`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
          achievement.unlocked 
            ? `bg-gradient-to-br ${rarityColors[achievement.rarity]} shadow-md` 
            : 'bg-muted'
        }`}>
          {achievement.unlocked ? (
            achievement.icon
          ) : (
            <Lock className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className={`font-medium ${achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
              {achievement.name}
            </h4>
            <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${
              achievement.rarity === 'legendary' ? 'bg-amber-100 text-amber-700' :
              achievement.rarity === 'epic' ? 'bg-purple-100 text-purple-700' :
              achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-700' :
              'bg-gray-100 text-gray-600'
            }`}>
              {achievement.rarity}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{achievement.description}</p>
          
          {!achievement.unlocked && achievement.progress !== undefined && (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Progress</span>
                <span>{achievement.progress}/{achievement.maxProgress}</span>
              </div>
              <Progress 
                value={(achievement.progress / (achievement.maxProgress || 1)) * 100} 
                className="h-1.5"
              />
            </div>
          )}
          
          {achievement.unlocked && achievement.unlockedAt && (
            <p className="text-xs text-muted-foreground mt-1">
              Unlocked {achievement.unlockedAt}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function AchievementsPanel() {
  const unlockedCount = mockAchievements.filter(a => a.unlocked).length;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-gold" />
          <h3 className="font-semibold text-foreground">Achievements</h3>
        </div>
        <span className="text-sm text-muted-foreground">
          {unlockedCount}/{mockAchievements.length} unlocked
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {mockAchievements.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </div>
  );
}
