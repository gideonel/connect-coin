import { motion } from 'framer-motion';
import { Shield, ArrowLeft, AlertTriangle, Users, MapPin, MessageSquare, Phone, CreditCard, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const SAFETY_SECTIONS = [
  {
    id: 'first-meeting',
    title: 'Meeting Someone New',
    icon: Users,
    tips: [
      'Always meet in a public place for your first few dates',
      'Tell a friend or family member your plans, including where and when',
      'Use your own transportation to and from the date',
      'Don\'t share your home address until you trust the person',
      'Trust your instincts - if something feels off, leave',
    ],
  },
  {
    id: 'location',
    title: 'Location Safety',
    icon: MapPin,
    tips: [
      'Don\'t enable precise location sharing with people you just met',
      'Be cautious about sharing photos that reveal your location',
      'Avoid mentioning your workplace or daily routine early on',
      'Use the app\'s built-in location features instead of sharing directly',
    ],
  },
  {
    id: 'messaging',
    title: 'Safe Communication',
    icon: MessageSquare,
    tips: [
      'Keep conversations on the app until you\'re comfortable',
      'Don\'t share personal info like your full name, address, or workplace',
      'Be wary of people who want to move to other platforms immediately',
      'Report users who send inappropriate or threatening messages',
    ],
  },
  {
    id: 'calls',
    title: 'Video & Voice Calls',
    icon: Phone,
    tips: [
      'Use in-app video calls to verify someone before meeting',
      'Be mindful of what\'s visible in your background',
      'Trust your instincts if someone avoids video calls',
      'Report any inappropriate behavior during calls',
    ],
  },
  {
    id: 'financial',
    title: 'Financial Safety',
    icon: CreditCard,
    tips: [
      'Never send money to someone you haven\'t met in person',
      'Be suspicious of anyone who asks for financial help',
      'Don\'t share banking or credit card information',
      'Report anyone who asks for money or gifts',
    ],
  },
  {
    id: 'emotional',
    title: 'Emotional Wellbeing',
    icon: Heart,
    tips: [
      'Take breaks from dating apps if you feel overwhelmed',
      'Don\'t take rejection personally - it\'s part of the process',
      'Block and report anyone who makes you uncomfortable',
      'Remember that healthy relationships take time to build',
    ],
  },
];

const SafetyGuidelines = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-background/80 backdrop-blur-lg border-b z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Safety Guidelines
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Hero section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Stay Safe While Dating</h2>
          <p className="text-muted-foreground">
            Your safety is our priority. Follow these guidelines to have a safe and enjoyable experience.
          </p>
        </motion.div>

        {/* Emergency notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mb-6"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-destructive">In Case of Emergency</h3>
              <p className="text-sm text-destructive/80">
                If you feel unsafe or in danger, contact local emergency services immediately. 
                In the US, call 911. You can also use our in-app emergency button during dates.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Safety sections */}
        <Accordion type="single" collapsible className="space-y-3">
          {SAFETY_SECTIONS.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <AccordionItem value={section.id} className="border rounded-xl px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <section.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-semibold">{section.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-3 pt-2 pb-4">
                    {section.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs text-primary font-medium">{tipIndex + 1}</span>
                        </div>
                        <span className="text-muted-foreground">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 space-y-3"
        >
          <h3 className="font-semibold mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-auto py-4 flex-col gap-2"
              onClick={() => navigate('/block-report?action=report')}
            >
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm">Report a User</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-4 flex-col gap-2"
              onClick={() => navigate('/photo-verification')}
            >
              <Shield className="w-5 h-5" />
              <span className="text-sm">Get Verified</span>
            </Button>
          </div>
        </motion.div>

        {/* Contact support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center p-6 bg-muted rounded-xl"
        >
          <h3 className="font-semibold mb-2">Need Help?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Our support team is available 24/7 to help with any safety concerns.
          </p>
          <Button variant="secondary">Contact Support</Button>
        </motion.div>
      </main>
    </div>
  );
};

export default SafetyGuidelines;
