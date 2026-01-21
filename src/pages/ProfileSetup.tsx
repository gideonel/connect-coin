import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ArrowRight, Camera, MapPin, Heart, 
  Sparkles, Check, Plus, X, User 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const INTERESTS = [
  'Travel', 'Music', 'Movies', 'Food', 'Fitness', 'Reading',
  'Gaming', 'Art', 'Photography', 'Dancing', 'Cooking', 'Sports',
  'Hiking', 'Yoga', 'Coffee', 'Wine', 'Pets', 'Fashion',
  'Technology', 'Nature', 'Beach', 'Mountains', 'Nightlife', 'Netflix'
];

const STEPS = ['basics', 'photos', 'interests', 'preferences'] as const;
type Step = typeof STEPS[number];

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { user, completeProfileSetup } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>('basics');
  
  // Form state
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState<'male' | 'female' | 'non-binary' | 'other'>('other');
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [lookingForGender, setLookingForGender] = useState<string[]>(['all']);
  const [ageRange, setAgeRange] = useState([18, 45]);
  const [relationshipType, setRelationshipType] = useState<'casual' | 'serious' | 'friendship' | 'any'>('any');

  const currentStepIndex = STEPS.indexOf(currentStep);

  const handlePhotoUpload = () => {
    // Simulate photo upload - in real app, this would use file input
    const demoPhotos = [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
    ];
    const randomPhoto = demoPhotos[Math.floor(Math.random() * demoPhotos.length)];
    if (photos.length < 6) {
      setPhotos([...photos, randomPhoto]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else if (interests.length < 10) {
      setInterests([...interests, interest]);
    } else {
      toast.error('Maximum 10 interests allowed');
    }
  };

  const toggleLookingForGender = (g: string) => {
    if (g === 'all') {
      setLookingForGender(['all']);
    } else {
      const newGenders = lookingForGender.filter(x => x !== 'all');
      if (newGenders.includes(g)) {
        setLookingForGender(newGenders.filter(x => x !== g));
      } else {
        setLookingForGender([...newGenders, g]);
      }
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'basics':
        return age >= 18 && gender && city;
      case 'photos':
        return photos.length >= 1;
      case 'interests':
        return interests.length >= 3;
      case 'preferences':
        return lookingForGender.length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentStepIndex + 1]);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(STEPS[currentStepIndex - 1]);
    }
  };

  const handleComplete = () => {
    completeProfileSetup({
      age,
      gender,
      bio,
      photos,
      location: { city, country },
      interests,
      lookingFor: {
        gender: lookingForGender,
        ageRange: { min: ageRange[0], max: ageRange[1] },
        relationshipType,
      },
    });
    toast.success('Profile setup complete!');
    navigate('/discover');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'basics':
        return (
          <motion.div
            key="basics"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                <User className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Basic Info</h2>
              <p className="text-muted-foreground mt-1">Tell us about yourself</p>
            </div>

            <div className="space-y-2">
              <Label>Age: {age}</Label>
              <Slider
                value={[age]}
                onValueChange={(v) => setAge(v[0])}
                min={18}
                max={80}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <div className="grid grid-cols-2 gap-3">
                {['male', 'female', 'non-binary', 'other'].map((g) => (
                  <Button
                    key={g}
                    type="button"
                    variant={gender === g ? 'default' : 'outline'}
                    onClick={() => setGender(g as typeof gender)}
                    className="capitalize"
                  >
                    {g.replace('-', ' ')}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell others about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={500}
                rows={4}
              />
              <p className="text-xs text-muted-foreground text-right">{bio.length}/500</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="city"
                    placeholder="Your city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        );

      case 'photos':
        return (
          <motion.div
            key="photos"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                <Camera className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Add Photos</h2>
              <p className="text-muted-foreground mt-1">Add at least 1 photo (up to 6)</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {photos.map((photo, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden">
                  <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-destructive rounded-full flex items-center justify-center text-destructive-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                      Main
                    </div>
                  )}
                </div>
              ))}
              {photos.length < 6 && (
                <button
                  onClick={handlePhotoUpload}
                  className="aspect-square rounded-xl border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors"
                >
                  <Plus className="w-6 h-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Add Photo</span>
                </button>
              )}
            </div>

            <p className="text-sm text-muted-foreground text-center">
              Tip: Profiles with 3+ photos get 5x more matches!
            </p>
          </motion.div>
        );

      case 'interests':
        return (
          <motion.div
            key="interests"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Your Interests</h2>
              <p className="text-muted-foreground mt-1">Select at least 3 interests ({interests.length}/10)</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((interest) => (
                <Button
                  key={interest}
                  type="button"
                  variant={interests.includes(interest) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleInterest(interest)}
                  className="rounded-full"
                >
                  {interest}
                  {interests.includes(interest) && <Check className="w-3 h-3 ml-1" />}
                </Button>
              ))}
            </div>
          </motion.div>
        );

      case 'preferences':
        return (
          <motion.div
            key="preferences"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                <Heart className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Dating Preferences</h2>
              <p className="text-muted-foreground mt-1">Who are you looking to meet?</p>
            </div>

            <div className="space-y-2">
              <Label>Interested in</Label>
              <div className="flex flex-wrap gap-2">
                {['male', 'female', 'non-binary', 'all'].map((g) => (
                  <Button
                    key={g}
                    type="button"
                    variant={lookingForGender.includes(g) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleLookingForGender(g)}
                    className="capitalize"
                  >
                    {g === 'all' ? 'Everyone' : g.replace('-', ' ')}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Age Range: {ageRange[0]} - {ageRange[1]}</Label>
              <Slider
                value={ageRange}
                onValueChange={setAgeRange}
                min={18}
                max={80}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <Label>Looking for</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'casual', label: 'Casual Dating' },
                  { value: 'serious', label: 'Serious Relationship' },
                  { value: 'friendship', label: 'Friendship' },
                  { value: 'any', label: 'Open to Anything' },
                ].map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    variant={relationshipType === option.value ? 'default' : 'outline'}
                    onClick={() => setRelationshipType(option.value as typeof relationshipType)}
                    className="h-auto py-3"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-muted">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={handleBack} disabled={currentStepIndex === 0}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <span className="text-sm text-muted-foreground">
          Step {currentStepIndex + 1} of {STEPS.length}
        </span>
        <div className="w-10" />
      </header>

      {/* Content */}
      <div className="flex-1 px-4 py-6 max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className="max-w-md mx-auto">
          <Button 
            onClick={handleNext} 
            className="w-full" 
            size="lg"
            disabled={!canProceed()}
          >
            {currentStepIndex === STEPS.length - 1 ? (
              <>Complete Setup</>
            ) : (
              <>Continue <ArrowRight className="w-4 h-4 ml-2" /></>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
