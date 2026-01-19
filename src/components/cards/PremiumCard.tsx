import { Check, Crown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface PremiumPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  popular: boolean;
  color: string;
}

interface PremiumCardProps {
  plan: PremiumPlan;
  onSelect: (planId: string) => void;
}

export const PremiumCard = ({ plan, onSelect }: PremiumCardProps) => {
  const gradientClasses = {
    silver: 'from-gray-300 to-gray-400',
    gold: 'from-amber-400 to-amber-600',
    platinum: 'from-purple-400 to-pink-500',
  };

  const gradient = gradientClasses[plan.id as keyof typeof gradientClasses] || plan.color;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`relative rounded-2xl overflow-hidden ${
        plan.popular ? 'ring-2 ring-primary shadow-glow' : 'shadow-card'
      }`}
    >
      {plan.popular && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-primary text-white text-center py-1 text-sm font-medium">
          Most Popular
        </div>
      )}

      <div className={`p-6 bg-card ${plan.popular ? 'pt-10' : ''}`}>
        {/* Plan header */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            {plan.id === 'platinum' ? (
              <Sparkles className="w-6 h-6 text-white" />
            ) : (
              <Crown className="w-6 h-6 text-white" />
            )}
          </div>
          <div>
            <h3 className="font-serif text-xl font-semibold">{plan.name}</h3>
            <Badge variant="outline" className="text-xs">
              {plan.id === 'platinum' ? 'VIP' : 'Premium'}
            </Badge>
          </div>
        </div>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold">${plan.price}</span>
            <span className="text-muted-foreground">/{plan.period}</span>
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-6">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Button
          className={`w-full ${plan.popular ? '' : ''}`}
          variant={plan.popular ? 'gradient' : 'outline'}
          onClick={() => onSelect(plan.id)}
        >
          {plan.id === 'platinum' ? 'Go Platinum' : `Choose ${plan.name}`}
        </Button>
      </div>
    </motion.div>
  );
};
