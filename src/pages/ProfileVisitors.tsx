
import { motion } from 'framer-motion';
import { Eye, ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { sampleUsers } from '@/data/sampleUsers';
import { formatDistanceToNow } from 'date-fns';

const ProfileVisitors = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Generate mock visitors data
  const visitors = sampleUsers.slice(0, 12).map((u, index) => ({
    id: `visitor_${index}`,
    visitor: u,
    visitedAt: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
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
              <Eye className="w-5 h-5 text-primary" />
              Profile Visitors
            </h1>
            <p className="text-sm text-muted-foreground">{visitors.length} people viewed your profile</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Premium notice */}
        {!isPremium && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-muted rounded-xl p-4 mb-6 text-center"
          >
            <p className="text-muted-foreground mb-2">
              Upgrade to Premium to see who visited your profile
            </p>
            <Button onClick={() => navigate('/premium')}>
              Get Premium
            </Button>
          </motion.div>
        )}

        {/* Visitors list */}
        <div className="space-y-3">
          {visitors.map((visit, index) => (
            <motion.div
              key={visit.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-4 p-3 bg-card rounded-xl border"
            >
              <div className={`relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 ${
                !isPremium ? 'blur-md' : ''
              }`}>
                <img
                  src={visit.visitor.photos[0]}
                  alt={visit.visitor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                {isPremium ? (
                  <>
                    <h3 className="font-semibold truncate">{visit.visitor.name}, {visit.visitor.age}</h3>
                    <p className="text-sm text-muted-foreground truncate">{visit.visitor.location}</p>
                  </>
                ) : (
                  <>
                    <div className="h-4 w-32 bg-muted rounded mb-1" />
                    <div className="h-3 w-20 bg-muted rounded" />
                  </>
                )}
              </div>

              <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(visit.visitedAt), { addSuffix: true })}
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProfileVisitors;
