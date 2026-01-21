import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, ArrowLeft, Check, Clock, AlertCircle, Upload, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const VERIFICATION_POSES = [
  { id: 1, instruction: 'Hold your hand up with palm facing the camera', icon: '✋' },
  { id: 2, instruction: 'Point to your forehead with one finger', icon: '👆' },
  { id: 3, instruction: 'Make a peace sign', icon: '✌️' },
];

const PhotoVerification = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState<'intro' | 'capture' | 'pending' | 'complete'>('intro');
  const [selectedPose] = useState(VERIFICATION_POSES[Math.floor(Math.random() * VERIFICATION_POSES.length)]);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  const verificationStatus = user?.verification?.photo 
    ? 'verified' 
    : user?.verification?.photoStatus || 'not_started';

  const handleCapture = () => {
    // Simulate photo capture
    setCapturedPhoto('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400');
    setCurrentStep('pending');
  };

  const handleSubmit = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    updateProfile({
      verification: {
        ...user?.verification,
        email: true,
        photo: false,
        photoStatus: 'pending',
        photoSubmittedAt: new Date().toISOString(),
      },
    });

    toast.success('Photo submitted for verification!');
    setCurrentStep('pending');
  };

  if (verificationStatus === 'verified') {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 bg-background/80 backdrop-blur-lg border-b z-10">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Photo Verification</h1>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-12 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 mx-auto rounded-full bg-green-500 flex items-center justify-center mb-6"
          >
            <Check className="w-12 h-12 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">You're Verified!</h2>
          <p className="text-muted-foreground mb-6">
            Your profile has a verification badge that others can see
          </p>
          <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-600 px-4 py-2 rounded-full">
            <Shield className="w-4 h-4" />
            Verified Profile
          </div>
        </main>
      </div>
    );
  }

  if (verificationStatus === 'pending' || currentStep === 'pending') {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 bg-background/80 backdrop-blur-lg border-b z-10">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Photo Verification</h1>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-12 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 mx-auto rounded-full bg-amber-500 flex items-center justify-center mb-6"
          >
            <Clock className="w-12 h-12 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Verification Pending</h2>
          <p className="text-muted-foreground mb-6">
            We're reviewing your photo. This usually takes 24-48 hours.
          </p>
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-600 px-4 py-2 rounded-full">
            <Clock className="w-4 h-4" />
            Under Review
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-background/80 backdrop-blur-lg border-b z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            Photo Verification
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {currentStep === 'intro' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Verify Your Profile</h2>
              <p className="text-muted-foreground">
                Get a verification badge and build trust with potential matches
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Why verify?</h3>
              <div className="grid gap-3">
                {[
                  { icon: '✨', text: 'Stand out with a verified badge' },
                  { icon: '🤝', text: 'Build trust with matches' },
                  { icon: '💬', text: 'Get more responses to messages' },
                  { icon: '🛡️', text: 'Help keep the community safe' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={() => setCurrentStep('capture')} className="w-full" size="lg">
              Start Verification
            </Button>
          </motion.div>
        )}

        {currentStep === 'capture' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold mb-2">Take a Selfie</h2>
              <p className="text-muted-foreground">
                Follow the pose below to verify you're a real person
              </p>
            </div>

            {/* Pose instruction */}
            <div className="bg-primary/10 rounded-2xl p-6 text-center">
              <span className="text-6xl block mb-4">{selectedPose.icon}</span>
              <p className="font-medium">{selectedPose.instruction}</p>
            </div>

            {/* Camera preview area */}
            <div className="aspect-square bg-muted rounded-2xl flex items-center justify-center relative overflow-hidden">
              {capturedPhoto ? (
                <img src={capturedPhoto} alt="Captured" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">Camera preview</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              {capturedPhoto ? (
                <>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setCapturedPhoto(null)}
                  >
                    Retake
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={handleSubmit}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Submit
                  </Button>
                </>
              ) : (
                <Button onClick={handleCapture} className="w-full" size="lg">
                  <Camera className="w-4 h-4 mr-2" />
                  Take Photo
                </Button>
              )}
            </div>

            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl text-sm">
              <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <p className="text-muted-foreground">
                Make sure your face is clearly visible and matches your profile photos.
                We'll review your photo within 24-48 hours.
              </p>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default PhotoVerification;
