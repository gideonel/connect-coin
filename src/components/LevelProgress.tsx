import { motion } from 'framer-motion';
import { mockUserStats } from '@/data/gamificationData';
import { Flame, TrendingUp, Heart, MessageCircle, ThumbsUp } from 'lucide-react';

export function LevelProgress() {
  const { level, xp, xpToNextLevel, streak, longestStreak, totalMatches, totalMessages, totalLikes } = mockUserStats;
  const progressPercent = (xp / xpToNextLevel) * 100;

  return (
    <div className="space-y-6">
      {/* Level Card */}
      <div className="bg-gradient-to-br from-primary/20 via-coral/20 to-gold/20 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
        
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Current Level</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-foreground">{level}</span>
                <span className="text-sm text-muted-foreground">Rising Star</span>
              </div>
            </div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-coral flex items-center justify-center shadow-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{xp} XP</span>
              <span className="text-muted-foreground">{xpToNextLevel} XP</span>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary via-coral to-gold rounded-full"
              />
            </div>
            <p className="text-xs text-center text-muted-foreground">
              {xpToNextLevel - xp} XP to Level {level + 1}
            </p>
          </div>
        </div>
      </div>

      {/* Streak Card */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
            <Flame className="w-6 h-6 text-orange-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">{streak}</span>
              <span className="text-sm text-muted-foreground">day streak</span>
            </div>
            <p className="text-xs text-muted-foreground">Best: {longestStreak} days</p>
          </div>
          <div className="text-right">
            <span className="text-2xl">🔥</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <Heart className="w-5 h-5 text-rose mx-auto mb-2" />
          <p className="text-xl font-bold text-foreground">{totalMatches}</p>
          <p className="text-xs text-muted-foreground">Matches</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <MessageCircle className="w-5 h-5 text-blue-500 mx-auto mb-2" />
          <p className="text-xl font-bold text-foreground">{totalMessages}</p>
          <p className="text-xs text-muted-foreground">Messages</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <ThumbsUp className="w-5 h-5 text-green-500 mx-auto mb-2" />
          <p className="text-xl font-bold text-foreground">{totalLikes}</p>
          <p className="text-xs text-muted-foreground">Likes Sent</p>
        </div>
      </div>
    </div>
  );
}
