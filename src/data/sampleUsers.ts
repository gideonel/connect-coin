export interface User {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: string;
  location: string;
  bio: string;
  photos: string[];
  interests: string[];
  lookingFor: string;
  verified: boolean;
  online: boolean;
  premium: 'free' | 'silver' | 'gold' | 'platinum';
  lastActive: string;
}

export const sampleUsers: User[] = [
  {
    id: '1',
    name: 'Sophia',
    age: 26,
    gender: 'female',
    height: "5'7\"",
    location: 'New York, NY',
    bio: 'Coffee lover ☕ | Adventure seeker 🌍 | Looking for genuine connections and good vibes. Let\'s explore the city together!',
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600',
    ],
    interests: ['Travel', 'Photography', 'Coffee', 'Hiking', 'Art'],
    lookingFor: 'Something serious',
    verified: true,
    online: true,
    premium: 'gold',
    lastActive: 'Just now',
  },
  {
    id: '2',
    name: 'Emma',
    age: 24,
    gender: 'female',
    height: "5'5\"",
    location: 'Los Angeles, CA',
    bio: 'Yoga instructor by day, foodie by night 🍕 Love deep conversations and spontaneous adventures.',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600',
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=600',
    ],
    interests: ['Yoga', 'Cooking', 'Music', 'Beach', 'Meditation'],
    lookingFor: 'Casual dating',
    verified: true,
    online: false,
    premium: 'platinum',
    lastActive: '2 hours ago',
  },
  {
    id: '3',
    name: 'Olivia',
    age: 28,
    gender: 'female',
    height: "5'8\"",
    location: 'Chicago, IL',
    bio: 'Marketing professional who loves to laugh 😊 Wine enthusiast 🍷 Looking for my partner in crime.',
    photos: [
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
    ],
    interests: ['Wine', 'Movies', 'Dancing', 'Reading', 'Brunch'],
    lookingFor: 'Something serious',
    verified: false,
    online: true,
    premium: 'free',
    lastActive: 'Just now',
  },
  {
    id: '4',
    name: 'Ava',
    age: 25,
    gender: 'female',
    height: "5'4\"",
    location: 'Miami, FL',
    bio: 'Beach baby 🏖️ Sunset chaser 🌅 Life is too short for boring conversations.',
    photos: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600',
    ],
    interests: ['Beach', 'Surfing', 'Fitness', 'Travel', 'Nightlife'],
    lookingFor: 'New friends',
    verified: true,
    online: true,
    premium: 'silver',
    lastActive: 'Just now',
  },
  {
    id: '5',
    name: 'Isabella',
    age: 27,
    gender: 'female',
    height: "5'6\"",
    location: 'Austin, TX',
    bio: 'Tech geek with a creative soul 🎨 Love live music and tacos 🌮',
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600',
    ],
    interests: ['Tech', 'Music', 'Art', 'Gaming', 'Foodie'],
    lookingFor: 'Something serious',
    verified: true,
    online: false,
    premium: 'gold',
    lastActive: '1 day ago',
  },
  {
    id: '6',
    name: 'James',
    age: 29,
    gender: 'male',
    height: "6'1\"",
    location: 'San Francisco, CA',
    bio: 'Startup founder by day, amateur chef by night 👨‍🍳 Looking for someone to share adventures with.',
    photos: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600',
    ],
    interests: ['Entrepreneurship', 'Cooking', 'Hiking', 'Tech', 'Wine'],
    lookingFor: 'Something serious',
    verified: true,
    online: true,
    premium: 'platinum',
    lastActive: 'Just now',
  },
  {
    id: '7',
    name: 'Michael',
    age: 31,
    gender: 'male',
    height: "5'11\"",
    location: 'Boston, MA',
    bio: 'Doctor who loves to travel ✈️ Gym rat 💪 Looking for my person.',
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
    ],
    interests: ['Fitness', 'Travel', 'Medicine', 'Coffee', 'Running'],
    lookingFor: 'Something serious',
    verified: true,
    online: false,
    premium: 'gold',
    lastActive: '3 hours ago',
  },
  {
    id: '8',
    name: 'Daniel',
    age: 26,
    gender: 'male',
    height: "6'0\"",
    location: 'Seattle, WA',
    bio: 'Software engineer who loves the outdoors 🏔️ Dog dad 🐕',
    photos: [
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600',
    ],
    interests: ['Coding', 'Hiking', 'Dogs', 'Photography', 'Gaming'],
    lookingFor: 'Casual dating',
    verified: false,
    online: true,
    premium: 'silver',
    lastActive: 'Just now',
  },
];

export const currentUser = {
  id: 'current',
  name: 'Alex',
  age: 27,
  tokens: 250,
  coins: 50,
  premium: 'gold' as const,
  matches: 12,
  likes: 48,
  profileViews: 156,
};

export const premiumPlans = [
  {
    id: 'silver',
    name: 'Silver',
    price: 9.99,
    period: 'month',
    features: [
      '10% token discount',
      'See who liked you',
      '5 Super Likes per day',
      'Priority customer support',
    ],
    popular: false,
    color: 'from-gray-300 to-gray-400',
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 19.99,
    period: 'month',
    features: [
      '25% token discount',
      'Unlimited likes',
      '10 Super Likes per day',
      'Voice calls included',
      'Profile boost monthly',
      'See who viewed your profile',
    ],
    popular: true,
    color: 'from-amber-400 to-amber-600',
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: 34.99,
    period: 'month',
    features: [
      '40% token discount',
      'Unlimited everything',
      'Video calls included',
      'Share contact details',
      'Weekly profile boost',
      'VIP badge',
      'Read receipts',
      'Priority matching',
    ],
    popular: false,
    color: 'from-purple-400 to-pink-500',
  },
];

export const tokenPackages = [
  { id: 1, tokens: 100, price: 4.99, bonus: 0 },
  { id: 2, tokens: 300, price: 12.99, bonus: 20 },
  { id: 3, tokens: 500, price: 19.99, bonus: 50 },
  { id: 4, tokens: 1000, price: 34.99, bonus: 150 },
];
