import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { compatibilityFactors } from '@/data/gamificationData';

interface CompatibilityScoreProps {
  score: number;
  showDetails?: boolean;
}

export function CompatibilityScore({ score, showDetails = false }: CompatibilityScoreProps) {
  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-green-500';
    if (s >= 60) return 'text-amber-500';
    return 'text-rose';
  };

  const getScoreLabel = (s: number) => {
    if (s >= 90) return 'Perfect Match!';
    if (s >= 80) return 'Great Match';
    if (s >= 60) return 'Good Match';
    return 'Worth a Shot';
  };

  // Generate random factor scores for demo
  const factorScores = compatibilityFactors.map(factor => ({
    name: factor,
    score: Math.floor(Math.random() * 40) + 60,
  }));

  return (
    <div className="space-y-3">
      {/* Main Score */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <svg className="w-16 h-16 -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="hsl(var(--secondary))"
              strokeWidth="6"
            />
            <motion.circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${(score / 100) * 176} 176`}
              initial={{ strokeDasharray: "0 176" }}
              animate={{ strokeDasharray: `${(score / 100) * 176} 176` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--coral))" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-lg font-bold ${getScoreColor(score)}`}>{score}%</span>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-rose fill-rose" />
            <span className="font-semibold text-foreground">{getScoreLabel(score)}</span>
          </div>
          <p className="text-xs text-muted-foreground">Compatibility Score</p>
        </div>
      </div>

      {/* Factor Breakdown */}
      {showDetails && (
        <div className="space-y-2 pt-2 border-t border-border">
          {factorScores.map((factor, index) => (
            <div key={factor.name} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-24">{factor.name}</span>
              <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${factor.score}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="h-full bg-gradient-to-r from-primary to-coral rounded-full"
                />
              </div>
              <span className="text-xs font-medium text-muted-foreground w-8">{factor.score}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
