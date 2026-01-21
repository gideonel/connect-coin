export interface UserProfile {
  id: string;
  email: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'non-binary' | 'other';
  bio: string;
  photos: string[];
  location: {
    city: string;
    country: string;
  };
  interests: string[];
  lookingFor: {
    gender: string[];
    ageRange: { min: number; max: number };
    relationshipType: 'casual' | 'serious' | 'friendship' | 'any';
  };
  premium: {
    isActive: boolean;
    plan?: 'silver' | 'gold' | 'platinum';
    expiresAt?: string;
  };
  tokens: number;
  coins: number;
  verification: {
    email: boolean;
    photo: boolean;
    photoSubmittedAt?: string;
    photoStatus?: 'pending' | 'approved' | 'rejected';
  };
  stats: {
    likes: number;
    superLikes: number;
    matches: number;
    profileViews: number;
  };
  settings: {
    showOnlineStatus: boolean;
    showDistance: boolean;
    showAge: boolean;
    notifications: {
      matches: boolean;
      messages: boolean;
      likes: boolean;
    };
  };
  blocked: string[];
  reported: string[];
  isOnline: boolean;
  lastActive: string;
  createdAt: string;
  boostedUntil?: string;
}

export interface Match {
  id: string;
  matchedUser: UserProfile;
  matchedAt: string;
  lastMessage?: string;
  unreadCount: number;
}

export interface Like {
  id: string;
  fromUser: UserProfile;
  likedAt: string;
  isSuperLike: boolean;
}

export interface ProfileVisitor {
  id: string;
  visitor: UserProfile;
  visitedAt: string;
}

export interface ScheduledDate {
  id: string;
  withUser: UserProfile;
  dateTime: string;
  location: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface Report {
  id: string;
  userId: string;
  reason: 'inappropriate' | 'spam' | 'fake' | 'harassment' | 'other';
  details?: string;
  createdAt: string;
}
