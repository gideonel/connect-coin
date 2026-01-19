import { Crown, Sparkles, Shield, Zap, Heart, MessageCircle, Video, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/Header';
import { PremiumCard } from '@/components/cards/PremiumCard';
import { premiumPlans } from '@/data/sampleUsers';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const Premium = () => {
  const benefits = [
    {
      icon: Heart,
      title: 'Unlimited Likes',
      description: 'Swipe right as many times as you want',
    },
    {
      icon: Eye,
      title: 'See Who Likes You',
      description: 'View everyone who liked your profile instantly',
    },
    {
      icon: MessageCircle,
      title: 'Priority Messages',
      description: 'Your messages appear at the top of their inbox',
    },
    {
      icon: Video,
      title: 'Video Calls',
      description: 'Connect face-to-face with your matches',
    },
    {
      icon: Shield,
      title: 'Profile Boost',
      description: 'Get 10x more profile views with weekly boosts',
    },
    {
      icon: Zap,
      title: 'Super Likes',
      description: 'Stand out with unlimited super likes daily',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <section className="relative py-16 px-4 overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-rose/10 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Badge className="mb-6 bg-gold/20 text-gold border-gold/30 px-4 py-1.5">
                <Crown className="w-3 h-3 mr-1" />
                Premium Memberships
              </Badge>

              <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6">
                Unlock Your <span className="gradient-text">Full Potential</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Get more matches, stand out from the crowd, and connect with the people 
                you're truly interested in. Premium members see 3x more matches!
              </p>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Crown className="w-16 h-16 text-gold mx-auto" />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Plans Section */}
        <section className="py-8 px-4">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {premiumPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PremiumCard
                    plan={plan}
                    onSelect={(id) => toast.success(`Selected ${id} plan! Payment coming soon.`)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                Premium <span className="gradient-text">Benefits</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Everything you need to make meaningful connections
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card rounded-2xl p-6 hover:shadow-elevated transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section className="py-16 px-4 bg-secondary/30">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                Free vs <span className="gradient-text">Premium</span>
              </h2>
            </motion.div>

            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="grid grid-cols-3 text-center font-semibold bg-secondary/50">
                <div className="p-4">Feature</div>
                <div className="p-4">Free</div>
                <div className="p-4 bg-gradient-to-r from-rose/20 to-coral/20">Premium</div>
              </div>
              {[
                { feature: 'Daily Likes', free: '10', premium: 'Unlimited' },
                { feature: 'Super Likes', free: '1/day', premium: 'Unlimited' },
                { feature: 'See Who Likes You', free: '❌', premium: '✅' },
                { feature: 'Profile Boost', free: '❌', premium: 'Weekly' },
                { feature: 'Voice Calls', free: '❌', premium: '✅' },
                { feature: 'Video Calls', free: '❌', premium: '✅' },
                { feature: 'Token Discount', free: '0%', premium: 'Up to 40%' },
              ].map((row, index) => (
                <div 
                  key={row.feature} 
                  className={`grid grid-cols-3 text-center ${index % 2 === 0 ? 'bg-background' : ''}`}
                >
                  <div className="p-4 text-left font-medium">{row.feature}</div>
                  <div className="p-4 text-muted-foreground">{row.free}</div>
                  <div className="p-4 bg-gradient-to-r from-rose/10 to-coral/10 font-medium">
                    {row.premium}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 p-12 text-center max-w-3xl mx-auto"
            >
              <Sparkles className="w-12 h-12 text-white mx-auto mb-4" />
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Find Your Match?
              </h2>
              <p className="text-white/80 mb-8 max-w-lg mx-auto">
                Join thousands of premium members who are already enjoying more matches and meaningful connections.
              </p>
              <Button 
                size="xl" 
                className="bg-white text-amber-600 hover:bg-white/90 shadow-lg"
                onClick={() => toast.success('Starting premium trial!')}
              >
                <Crown className="w-5 h-5 mr-2" />
                Start Free Trial
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Premium;