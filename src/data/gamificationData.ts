// Gamification and User Progress Data

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
  category: 'social' | 'profile' | 'premium' | 'streak';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface DailyReward {
  day: number;
  reward: string;
  amount: number;
  type: 'tokens' | 'coins' | 'boost' | 'superlike';
  claimed: boolean;
}

export interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  longestStreak: number;
  totalMatches: number;
  totalMessages: number;
  totalLikes: number;
  profileCompleteness: number;
}

export const mockAchievements: Achievement[] = [
  {
    id: 'first_match',
    name: 'First Spark',
    description: 'Get your first match',
    icon: '💘',
    unlocked: true,
    unlockedAt: '2024-03-10',
    category: 'social',
    rarity: 'common',
  },
  {
    id: 'profile_complete',
    name: 'Picture Perfect',
    description: 'Complete your profile 100%',
    icon: '📸',
    unlocked: true,
    unlockedAt: '2024-03-08',
    category: 'profile',
    rarity: 'common',
  },
  {
    id: 'conversation_starter',
    name: 'Conversation Starter',
    description: 'Send 50 messages',
    icon: '💬',
    unlocked: false,
    progress: 32,
    maxProgress: 50,
    category: 'social',
    rarity: 'rare',
  },
  {
    id: 'super_liker',
    name: 'Super Star',
    description: 'Use 10 Super Likes',
    icon: '⭐',
    unlocked: false,
    progress: 4,
    maxProgress: 10,
    category: 'social',
    rarity: 'rare',
  },
  {
    id: 'week_streak',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    unlocked: true,
    unlockedAt: '2024-03-15',
    category: 'streak',
    rarity: 'rare',
  },
  {
    id: 'month_streak',
    name: 'Dedication',
    description: 'Maintain a 30-day streak',
    icon: '🏆',
    unlocked: false,
    progress: 12,
    maxProgress: 30,
    category: 'streak',
    rarity: 'epic',
  },
  {
    id: 'hundred_matches',
    name: 'Popular',
    description: 'Get 100 matches',
    icon: '💯',
    unlocked: false,
    progress: 12,
    maxProgress: 100,
    category: 'social',
    rarity: 'epic',
  },
  {
    id: 'premium_member',
    name: 'VIP Status',
    description: 'Subscribe to Premium',
    icon: '👑',
    unlocked: true,
    unlockedAt: '2024-02-01',
    category: 'premium',
    rarity: 'legendary',
  },
];

export const mockDailyRewards: DailyReward[] = [
  { day: 1, reward: 'Tokens', amount: 10, type: 'tokens', claimed: true },
  { day: 2, reward: 'Tokens', amount: 15, type: 'tokens', claimed: true },
  { day: 3, reward: 'Super Like', amount: 1, type: 'superlike', claimed: true },
  { day: 4, reward: 'Tokens', amount: 25, type: 'tokens', claimed: false },
  { day: 5, reward: 'Profile Boost', amount: 1, type: 'boost', claimed: false },
  { day: 6, reward: 'Tokens', amount: 40, type: 'tokens', claimed: false },
  { day: 7, reward: 'Coins', amount: 10, type: 'coins', claimed: false },
];

export const mockUserStats: UserStats = {
  level: 8,
  xp: 2450,
  xpToNextLevel: 3000,
  streak: 12,
  longestStreak: 15,
  totalMatches: 48,
  totalMessages: 234,
  totalLikes: 156,
  profileCompleteness: 85,
};

export const compatibilityFactors = [
  'Interests',
  'Location',
  'Age Preference',
  'Looking For',
  'Lifestyle',
  'Values',
];

export const icebreakers = [
  "What's the most spontaneous thing you've ever done?",
  "If you could have dinner with anyone, who would it be?",
  "What's your idea of a perfect weekend?",
  "What's on your bucket list?",
  "What's the best trip you've ever taken?",
  "Coffee or wine? And what's your go-to order?",
  "What's something you're passionate about?",
  "Dogs or cats? (Choose wisely! 😄)",
];
