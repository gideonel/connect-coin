import { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, ArrowLeft, Mic, MicOff, VideoOff, PhoneOff, Maximize2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { sampleUsers } from '@/data/sampleUsers';

const VideoCall = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('user') || '1';
  const callType = searchParams.get('type') || 'video';
  
  const user = sampleUsers.find(u => u.id.toString() === userId) || sampleUsers[0];

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(callType === 'audio');
  const [callDuration] = useState(125); // Simulated duration in seconds

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    navigate(-1);
  };

  return (
    <div className="fixed inset-0 bg-black">
      {/* Remote video (full screen) */}
      <div className="absolute inset-0">
        {!isVideoOff ? (
          <img
            src={user.photos[0]}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                <img
                  src={user.photos[0]}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-white text-xl font-semibold">{user.name}</h2>
              <p className="text-white/60">Audio Call</p>
            </div>
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
      </div>

      {/* Top bar */}
      <div className="absolute top-0 inset-x-0 p-4 flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-white/20"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        
        <div className="text-center">
          <h3 className="text-white font-semibold">{user.name}</h3>
          <p className="text-white/60 text-sm">{formatDuration(callDuration)}</p>
        </div>
        
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
          <Maximize2 className="w-6 h-6" />
        </Button>
      </div>

      {/* Self video (picture-in-picture) */}
      {!isVideoOff && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-20 right-4 w-28 h-40 rounded-2xl overflow-hidden border-2 border-white/30 bg-gray-800"
        >
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
            <span className="text-white/60 text-xs">You</span>
          </div>
        </motion.div>
      )}

      {/* Token cost indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-20 left-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm"
      >
        {callType === 'video' ? '5' : '3'} tokens/min
      </motion.div>

      {/* Bottom controls */}
      <div className="absolute bottom-0 inset-x-0 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-4"
        >
          {/* Mute button */}
          <Button
            size="lg"
            variant="ghost"
            className={`w-14 h-14 rounded-full ${
              isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-white/20 hover:bg-white/30'
            }`}
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? (
              <MicOff className="w-6 h-6 text-white" />
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
          </Button>

          {/* Video toggle button */}
          <Button
            size="lg"
            variant="ghost"
            className={`w-14 h-14 rounded-full ${
              isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-white/20 hover:bg-white/30'
            }`}
            onClick={() => setIsVideoOff(!isVideoOff)}
          >
            {isVideoOff ? (
              <VideoOff className="w-6 h-6 text-white" />
            ) : (
              <Video className="w-6 h-6 text-white" />
            )}
          </Button>

          {/* End call button */}
          <Button
            size="lg"
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600"
            onClick={handleEndCall}
          >
            <PhoneOff className="w-7 h-7 text-white" />
          </Button>

          {/* Chat button */}
          <Button
            size="lg"
            variant="ghost"
            className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30"
          >
            <MessageSquare className="w-6 h-6 text-white" />
          </Button>

          {/* Switch camera (placeholder) */}
          <Button
            size="lg"
            variant="ghost"
            className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30"
          >
            <Video className="w-6 h-6 text-white" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default VideoCall;
