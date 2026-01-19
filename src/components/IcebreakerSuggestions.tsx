import { useState } from 'react';
import { Lightbulb, RefreshCw, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { icebreakers } from '@/data/gamificationData';

interface IcebreakerSuggestionsProps {
  onSelect: (message: string) => void;
}

export function IcebreakerSuggestions({ onSelect }: IcebreakerSuggestionsProps) {
  const [suggestions, setSuggestions] = useState(() => 
    icebreakers.sort(() => 0.5 - Math.random()).slice(0, 3)
  );
  const [isOpen, setIsOpen] = useState(false);

  const refreshSuggestions = () => {
    const newSuggestions = icebreakers
      .filter(i => !suggestions.includes(i))
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    setSuggestions(newSuggestions.length >= 3 ? newSuggestions : icebreakers.slice(0, 3));
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="gap-1 text-xs"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Lightbulb className="w-4 h-4 text-gold" />
        Icebreakers
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-0 right-0 mb-2 bg-card rounded-xl border border-border shadow-lg p-3 z-10"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">
                Conversation Starters
              </span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={refreshSuggestions}>
                <RefreshCw className="w-3 h-3" />
              </Button>
            </div>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={suggestion}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    onSelect(suggestion);
                    setIsOpen(false);
                  }}
                  className="w-full text-left p-2 rounded-lg bg-secondary/50 hover:bg-secondary text-sm text-foreground transition-colors flex items-center gap-2"
                >
                  <span className="flex-1">{suggestion}</span>
                  <Send className="w-3 h-3 text-muted-foreground" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
