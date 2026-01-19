import { Heart, Sparkles, Shield, Users, ArrowRight, Star, MessageCircle, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PremiumCard } from '@/components/cards/PremiumCard';
import { premiumPlans } from '@/data/sampleUsers';
import heroCoupleImage from '@/assets/hero-couple.jpg';

const Landing = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-rose/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-coral/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl" />
        </div>

        {/* Floating hearts */}
        <motion.div
          className="absolute top-32 left-[15%] text-rose-light opacity-40"
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Heart className="w-8 h-8 fill-current" />
        </motion.div>
        <motion.div
          className="absolute top-48 right-[20%] text-coral opacity-30"
          animate={{ y: [0, -15, 0], rotate: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <Heart className="w-12 h-12 fill-current" />
        </motion.div>
        <motion.div
          className="absolute bottom-40 left-[25%] text-gold opacity-40"
          animate={{ y: [0, -25, 0], rotate: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <Star className="w-6 h-6 fill-current" />
        </motion.div>

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-gradient-to-r from-rose/20 to-coral/20 border-rose/30 text-rose px-4 py-1.5">
              <Sparkles className="w-3 h-3 mr-1" />
              Where meaningful connections begin
            </Badge>

            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              Find Your <br />
              <span className="gradient-text">Perfect Match</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Discover genuine connections with people who share your values. 
              Swipe, match, and start a conversation that could change your life.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/discover">
                <Button variant="hero" size="xl" className="group">
                  Start Swiping
                  <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/premium">
                <Button variant="hero-outline" size="xl">
                  View Premium Plans
                </Button>
              </Link>
            </div>

            {/* Stats */}
            {/* Hero Image */}
            <motion.div 
              className="mt-12 mb-8 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-elevated">
                <img 
                  src={heroCoupleImage} 
                  alt="Happy couple finding love on SingleAnd Soaring"
                  className="w-full h-64 md:h-80 lg:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="flex flex-wrap justify-center gap-8 mt-8"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {[
                { value: '10M+', label: 'Active Users' },
                { value: '2M+', label: 'Matches Made' },
                { value: '98%', label: 'Satisfaction' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  variants={fadeInUp}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-serif font-bold gradient-text">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">
              Why Choose <span className="gradient-text">SingleAnd Soaring</span>?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              More than just swiping — we're building meaningful connections
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Heart,
                title: 'Smart Matching',
                description: 'Our algorithm learns your preferences to show you compatible matches',
              },
              {
                icon: Shield,
                title: 'Safe & Secure',
                description: 'Verified profiles and encrypted messages keep you protected',
              },
              {
                icon: MessageCircle,
                title: 'Token Messaging',
                description: 'Quality conversations powered by our token-based system',
              },
              {
                icon: Video,
                title: 'Voice & Video',
                description: 'Connect deeper with in-app voice and video calls',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-2xl p-6 hover:shadow-elevated transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rose to-coral flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Plans Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-gold/20 text-gold border-gold/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Premium Memberships
            </Badge>
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">
              Unlock <span className="gradient-text">More Possibilities</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Get more matches, messages, and meaningful connections with our premium plans
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {premiumPlans.map((plan) => (
              <PremiumCard 
                key={plan.id} 
                plan={plan} 
                onSelect={(id) => console.log('Selected plan:', id)} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-rose to-coral p-12 md:p-16 text-center"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full" />
              <div className="absolute bottom-10 right-10 w-48 h-48 border-2 border-white rounded-full" />
              <div className="absolute top-1/2 left-1/3 w-24 h-24 border-2 border-white rounded-full" />
            </div>

            <div className="relative z-10">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block mb-6"
              >
                <Heart className="w-16 h-16 text-white fill-white/30" />
              </motion.div>
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-white/80 max-w-xl mx-auto mb-8">
                Join millions of people finding love, friendship, and meaningful connections every day.
              </p>
              <Link to="/discover">
                <Button 
                  size="xl" 
                  className="bg-white text-rose hover:bg-white/90 shadow-lg"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Find Your Match Now
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-rose to-coral flex items-center justify-center">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="font-serif text-xl font-semibold">
                SingleAnd <span className="gradient-text">Soaring</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 SingleAnd Soaring. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;