import { useState, useEffect } from 'react';
import { Search, Send, Phone, Video, MoreVertical, Image, Mic, Smile, CheckCheck, Coins, Heart, ThumbsUp, Laugh } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/Header';
import { sampleUsers, currentUser } from '@/data/sampleUsers';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { TypingIndicator } from '@/components/TypingIndicator';
import { IcebreakerSuggestions } from '@/components/IcebreakerSuggestions';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
  reaction?: string;
}

const mockConversations = sampleUsers.slice(0, 5).map((user, index) => ({
  user,
  messages: [
    {
      id: '1',
      senderId: user.id,
      text: index === 0 
        ? 'Hey! I saw we matched 😊' 
        : index === 1 
        ? 'Would love to grab coffee sometime!'
        : 'How are you doing today?',
      timestamp: index === 0 ? '2 min ago' : index === 1 ? '1 hour ago' : '3 hours ago',
      read: index !== 0,
    },
  ],
  unread: index === 0 ? 1 : 0,
}));

const reactions = ['❤️', '👍', '😂', '😮', '😢', '🔥'];

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState<typeof mockConversations[0] | null>(null);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showReactions, setShowReactions] = useState<string | null>(null);

  // Simulate typing indicator
  useEffect(() => {
    if (selectedConversation) {
      const timer = setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [selectedConversation]);

  const handleSelectConversation = (conversation: typeof mockConversations[0]) => {
    setSelectedConversation(conversation);
    setMessages([
      ...conversation.messages,
      {
        id: '2',
        senderId: 'current',
        text: 'Hi there! Nice to meet you 👋',
        timestamp: '1 min ago',
        read: true,
      },
      {
        id: '3',
        senderId: conversation.user.id,
        text: 'The pleasure is mine! I love your profile. What are you up to this weekend?',
        timestamp: 'Just now',
        read: false,
      },
    ]);
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;

    if (currentUser.tokens < 5) {
      toast.error('Not enough tokens', {
        description: 'You need 5 tokens to send a message',
        action: {
          label: 'Buy Tokens',
          onClick: () => console.log('Buy tokens'),
        },
      });
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'current',
      text: messageText,
      timestamp: 'Just now',
      read: false,
    };

    setMessages([...messages, newMessage]);
    setMessageText('');
    toast.success('Message sent!', {
      description: '5 tokens deducted',
      icon: <Coins className="w-4 h-4 text-gold" />,
    });

    // Simulate reply
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          senderId: selectedConversation.user.id,
          text: "That sounds great! 😊",
          timestamp: 'Just now',
          read: false,
        }]);
      }, 2000);
    }, 1000);
  };

  const handleIcebreakerSelect = (message: string) => {
    setMessageText(message);
  };

  const handleReaction = (messageId: string, reaction: string) => {
    setMessages(messages.map(m => 
      m.id === messageId ? { ...m, reaction } : m
    ));
    setShowReactions(null);
    toast.success(`Reacted with ${reaction}`);
  };

  const filteredConversations = mockConversations.filter(conv =>
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16 h-screen flex">
        {/* Conversations List */}
        <div className={`w-full md:w-80 lg:w-96 border-r border-border flex flex-col ${selectedConversation ? 'hidden md:flex' : ''}`}>
          <div className="p-4 border-b border-border">
            <h1 className="font-serif text-2xl font-bold mb-4">Messages</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <motion.button
                key={conversation.user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => handleSelectConversation(conversation)}
                className={`w-full p-4 flex items-center gap-3 hover:bg-secondary/50 transition-colors text-left border-b border-border/50 ${
                  selectedConversation?.user.id === conversation.user.id ? 'bg-secondary' : ''
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={conversation.user.photos[0]}
                    alt={conversation.user.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  {conversation.user.online && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 ring-2 ring-background" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold truncate">{conversation.user.name}</h3>
                    <span className="text-xs text-muted-foreground">
                      {conversation.messages[0].timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.messages[0].text}
                  </p>
                </div>
                {conversation.unread > 0 && (
                  <Badge className="bg-gradient-to-r from-rose to-coral text-white border-0 min-w-[24px] h-6 flex items-center justify-center">
                    {conversation.unread}
                  </Badge>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-background">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setSelectedConversation(null)}
                >
                  ←
                </Button>
                <div className="relative">
                  <img
                    src={selectedConversation.user.photos[0]}
                    alt={selectedConversation.user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {selectedConversation.user.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 ring-2 ring-background" />
                  )}
                </div>
                <div>
                  <h2 className="font-semibold">{selectedConversation.user.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    {selectedConversation.user.online ? 'Online now' : selectedConversation.user.lastActive}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => toast.info('Voice calls cost 10 tokens/min')}>
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => toast.info('Video calls cost 20 tokens/min')}>
                  <Video className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((message) => {
                  const isCurrentUser = message.senderId === 'current';
                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} group`}
                    >
                      <div className="relative">
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                            isCurrentUser
                              ? 'bg-gradient-to-r from-rose to-coral text-white rounded-br-md'
                              : 'bg-secondary rounded-bl-md'
                          }`}
                          onDoubleClick={() => !isCurrentUser && setShowReactions(message.id)}
                        >
                          <p className="text-sm">{message.text}</p>
                          <div className={`flex items-center gap-1 mt-1 ${isCurrentUser ? 'justify-end' : ''}`}>
                            <span className={`text-xs ${isCurrentUser ? 'text-white/70' : 'text-muted-foreground'}`}>
                              {message.timestamp}
                            </span>
                            {isCurrentUser && (
                              <CheckCheck className={`w-4 h-4 ${message.read ? 'text-blue-300' : 'text-white/50'}`} />
                            )}
                          </div>
                        </div>
                        
                        {/* Reaction */}
                        {message.reaction && (
                          <div className={`absolute -bottom-2 ${isCurrentUser ? 'left-2' : 'right-2'} bg-card rounded-full px-1 shadow-sm border border-border`}>
                            <span className="text-sm">{message.reaction}</span>
                          </div>
                        )}

                        {/* Reaction Picker */}
                        <AnimatePresence>
                          {showReactions === message.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="absolute bottom-full mb-2 left-0 bg-card rounded-full shadow-lg border border-border p-1 flex gap-1"
                            >
                              {reactions.map(reaction => (
                                <button
                                  key={reaction}
                                  onClick={() => handleReaction(message.id, reaction)}
                                  className="hover:scale-125 transition-transform p-1"
                                >
                                  {reaction}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3">
                    <TypingIndicator />
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-border bg-background">
              {/* Icebreaker Suggestions */}
              <div className="flex items-center gap-2 mb-2">
                <IcebreakerSuggestions onSelect={handleIcebreakerSelect} />
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Image className="w-5 h-5" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="pr-10"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                  >
                    <Smile className="w-4 h-4" />
                  </Button>
                </div>
                <Button variant="ghost" size="icon">
                  <Mic className="w-5 h-5" />
                </Button>
                <Button
                  variant="gradient"
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center flex items-center justify-center gap-1">
                <Coins className="w-3 h-3 text-gold" />
                5 tokens per message • Double-tap to react
              </p>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                <Send className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="font-serif text-2xl font-semibold mb-2">Your Messages</h2>
              <p className="text-muted-foreground">
                Select a conversation to start chatting
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Messages;