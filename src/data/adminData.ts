// Admin Dashboard Mock Data

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'suspended' | 'banned';
  premium: 'free' | 'silver' | 'gold' | 'platinum';
  verified: boolean;
  joinedDate: string;
  lastActive: string;
  totalSpent: number;
  reports: number;
}

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  reportedId: string;
  reportedName: string;
  reason: string;
  description: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: string;
  photoUrl?: string;
}

export interface TokenSettings {
  messageTokenCost: number;
  voiceCallTokenPerMin: number;
  videoCallTokenPerMin: number;
  photoShareTokenCost: number;
  superLikeTokenCost: number;
  profileBoostTokenCost: number;
}

export interface CoinPackage {
  id: string;
  coins: number;
  price: number;
  bonus: number;
  active: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: 'month' | 'year';
  tokenDiscount: number;
  features: string[];
  active: boolean;
  subscribers: number;
}

export interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  premiumUsers: number;
  totalRevenue: number;
  dailySignups: { date: string; count: number }[];
  revenueByDay: { date: string; amount: number }[];
  usersByPlan: { plan: string; count: number }[];
  topCountries: { country: string; users: number }[];
}

export const mockAdminUsers: AdminUser[] = [
  {
    id: '1',
    name: 'Sophia Johnson',
    email: 'sophia@email.com',
    status: 'active',
    premium: 'gold',
    verified: true,
    joinedDate: '2024-01-15',
    lastActive: '2 hours ago',
    totalSpent: 249.99,
    reports: 0,
  },
  {
    id: '2',
    name: 'Emma Williams',
    email: 'emma@email.com',
    status: 'active',
    premium: 'platinum',
    verified: true,
    joinedDate: '2024-02-20',
    lastActive: 'Just now',
    totalSpent: 499.99,
    reports: 0,
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael@email.com',
    status: 'suspended',
    premium: 'free',
    verified: false,
    joinedDate: '2024-03-01',
    lastActive: '5 days ago',
    totalSpent: 0,
    reports: 3,
  },
  {
    id: '4',
    name: 'Olivia Davis',
    email: 'olivia@email.com',
    status: 'active',
    premium: 'silver',
    verified: true,
    joinedDate: '2024-01-28',
    lastActive: '1 day ago',
    totalSpent: 89.99,
    reports: 0,
  },
  {
    id: '5',
    name: 'James Wilson',
    email: 'james@email.com',
    status: 'banned',
    premium: 'free',
    verified: false,
    joinedDate: '2024-02-10',
    lastActive: '2 weeks ago',
    totalSpent: 19.99,
    reports: 7,
  },
  {
    id: '6',
    name: 'Ava Martinez',
    email: 'ava@email.com',
    status: 'active',
    premium: 'gold',
    verified: true,
    joinedDate: '2024-03-15',
    lastActive: '3 hours ago',
    totalSpent: 179.99,
    reports: 0,
  },
];

export const mockReports: Report[] = [
  {
    id: '1',
    reporterId: '1',
    reporterName: 'Sophia Johnson',
    reportedId: '5',
    reportedName: 'James Wilson',
    reason: 'Inappropriate content',
    description: 'Sent inappropriate photos without consent',
    status: 'pending',
    createdAt: '2024-03-18',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
  },
  {
    id: '2',
    reporterId: '4',
    reporterName: 'Olivia Davis',
    reportedId: '3',
    reportedName: 'Michael Brown',
    reason: 'Spam/Scam',
    description: 'Keeps asking for money and personal information',
    status: 'reviewed',
    createdAt: '2024-03-17',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
  },
  {
    id: '3',
    reporterId: '2',
    reporterName: 'Emma Williams',
    reportedId: '5',
    reportedName: 'James Wilson',
    reason: 'Harassment',
    description: 'Continuous unwanted messages after being blocked',
    status: 'pending',
    createdAt: '2024-03-16',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
  },
  {
    id: '4',
    reporterId: '6',
    reporterName: 'Ava Martinez',
    reportedId: '3',
    reportedName: 'Michael Brown',
    reason: 'Fake profile',
    description: 'Photos appear to be stolen from a celebrity',
    status: 'resolved',
    createdAt: '2024-03-15',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
  },
];

export const mockTokenSettings: TokenSettings = {
  messageTokenCost: 5,
  voiceCallTokenPerMin: 10,
  videoCallTokenPerMin: 20,
  photoShareTokenCost: 15,
  superLikeTokenCost: 25,
  profileBoostTokenCost: 50,
};

export const mockCoinPackages: CoinPackage[] = [
  { id: '1', coins: 100, price: 4.99, bonus: 0, active: true },
  { id: '2', coins: 300, price: 12.99, bonus: 20, active: true },
  { id: '3', coins: 500, price: 19.99, bonus: 50, active: true },
  { id: '4', coins: 1000, price: 34.99, bonus: 150, active: true },
  { id: '5', coins: 2500, price: 79.99, bonus: 500, active: false },
];

export const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'silver',
    name: 'Silver',
    price: 9.99,
    period: 'month',
    tokenDiscount: 10,
    features: ['10% token discount', 'See who liked you', '5 Super Likes per day', 'Priority support'],
    active: true,
    subscribers: 1250,
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 19.99,
    period: 'month',
    tokenDiscount: 25,
    features: ['25% token discount', 'Unlimited likes', '10 Super Likes per day', 'Voice calls', 'Monthly boost', 'See profile viewers'],
    active: true,
    subscribers: 3420,
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: 34.99,
    period: 'month',
    tokenDiscount: 40,
    features: ['40% token discount', 'Unlimited everything', 'Video calls', 'Share contacts', 'Weekly boost', 'VIP badge', 'Read receipts', 'Priority matching'],
    active: true,
    subscribers: 890,
  },
];

export const mockAnalytics: AnalyticsData = {
  totalUsers: 45892,
  activeUsers: 12450,
  premiumUsers: 5560,
  totalRevenue: 289450,
  dailySignups: [
    { date: 'Mar 12', count: 145 },
    { date: 'Mar 13', count: 189 },
    { date: 'Mar 14', count: 156 },
    { date: 'Mar 15', count: 234 },
    { date: 'Mar 16', count: 198 },
    { date: 'Mar 17', count: 267 },
    { date: 'Mar 18', count: 312 },
  ],
  revenueByDay: [
    { date: 'Mar 12', amount: 4520 },
    { date: 'Mar 13', amount: 5890 },
    { date: 'Mar 14', amount: 4230 },
    { date: 'Mar 15', amount: 7650 },
    { date: 'Mar 16', amount: 6120 },
    { date: 'Mar 17', amount: 8930 },
    { date: 'Mar 18', amount: 9450 },
  ],
  usersByPlan: [
    { plan: 'Free', count: 40332 },
    { plan: 'Silver', count: 1250 },
    { plan: 'Gold', count: 3420 },
    { plan: 'Platinum', count: 890 },
  ],
  topCountries: [
    { country: 'United States', users: 18540 },
    { country: 'United Kingdom', users: 8920 },
    { country: 'Canada', users: 6430 },
    { country: 'Australia', users: 4250 },
    { country: 'Germany', users: 3120 },
  ],
};
