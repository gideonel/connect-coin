import { useState } from 'react';
import { X, Sliders, Users, MapPin, Ruler, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
}

export interface FilterState {
  gender: string[];
  ageRange: [number, number];
  distance: number;
  heightRange: [number, number];
  lookingFor: string[];
  onlineOnly: boolean;
  verifiedOnly: boolean;
  withPhotos: boolean;
}

const genderOptions = ['Women', 'Men', 'Non-binary'];
const lookingForOptions = ['Something serious', 'Casual dating', 'New friends', 'Not sure yet'];

export function FilterPanel({ isOpen, onClose, onApply }: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterState>({
    gender: ['Women'],
    ageRange: [22, 35],
    distance: 25,
    heightRange: [150, 190],
    lookingFor: [],
    onlineOnly: false,
    verifiedOnly: false,
    withPhotos: true,
  });

  const toggleGender = (gender: string) => {
    setFilters(prev => ({
      ...prev,
      gender: prev.gender.includes(gender)
        ? prev.gender.filter(g => g !== gender)
        : [...prev.gender, gender]
    }));
  };

  const toggleLookingFor = (option: string) => {
    setFilters(prev => ({
      ...prev,
      lookingFor: prev.lookingFor.includes(option)
        ? prev.lookingFor.filter(l => l !== option)
        : [...prev.lookingFor, option]
    }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      gender: ['Women'],
      ageRange: [22, 35],
      distance: 25,
      heightRange: [150, 190],
      lookingFor: [],
      onlineOnly: false,
      verifiedOnly: false,
      withPhotos: true,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-background shadow-2xl overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-primary" />
                <h2 className="font-serif text-xl font-bold">Filters</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  Reset
                </Button>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* Gender */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <h3 className="font-medium text-foreground">Show me</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {genderOptions.map(gender => (
                    <Badge
                      key={gender}
                      variant={filters.gender.includes(gender) ? 'default' : 'outline'}
                      className={`cursor-pointer py-2 px-4 ${
                        filters.gender.includes(gender) 
                          ? 'bg-primary text-primary-foreground' 
                          : ''
                      }`}
                      onClick={() => toggleGender(gender)}
                    >
                      {gender}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Age Range */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-muted-foreground" />
                    <h3 className="font-medium text-foreground">Age range</h3>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {filters.ageRange[0]} - {filters.ageRange[1]} years
                  </span>
                </div>
                <Slider
                  value={filters.ageRange}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, ageRange: value as [number, number] }))}
                  min={18}
                  max={80}
                  step={1}
                  className="py-4"
                />
              </div>

              {/* Distance */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <h3 className="font-medium text-foreground">Maximum distance</h3>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {filters.distance} miles
                  </span>
                </div>
                <Slider
                  value={[filters.distance]}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, distance: value[0] }))}
                  min={1}
                  max={100}
                  step={1}
                  className="py-4"
                />
              </div>

              {/* Height Range */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Ruler className="w-5 h-5 text-muted-foreground" />
                    <h3 className="font-medium text-foreground">Height range</h3>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {Math.floor(filters.heightRange[0] / 30.48)}'{Math.round((filters.heightRange[0] % 30.48) / 2.54)}" - 
                    {Math.floor(filters.heightRange[1] / 30.48)}'{Math.round((filters.heightRange[1] % 30.48) / 2.54)}"
                  </span>
                </div>
                <Slider
                  value={filters.heightRange}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, heightRange: value as [number, number] }))}
                  min={140}
                  max={210}
                  step={1}
                  className="py-4"
                />
              </div>

              {/* Looking For */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-muted-foreground" />
                  <h3 className="font-medium text-foreground">Looking for</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {lookingForOptions.map(option => (
                    <Badge
                      key={option}
                      variant={filters.lookingFor.includes(option) ? 'default' : 'outline'}
                      className={`cursor-pointer py-2 px-3 ${
                        filters.lookingFor.includes(option) 
                          ? 'bg-primary text-primary-foreground' 
                          : ''
                      }`}
                      onClick={() => toggleLookingFor(option)}
                    >
                      {option}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Toggle Filters */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
                  <div>
                    <p className="font-medium text-foreground">Online now</p>
                    <p className="text-sm text-muted-foreground">Only show users currently online</p>
                  </div>
                  <Switch
                    checked={filters.onlineOnly}
                    onCheckedChange={(checked) => setFilters(prev => ({ ...prev, onlineOnly: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
                  <div>
                    <p className="font-medium text-foreground">Verified only</p>
                    <p className="text-sm text-muted-foreground">Only show verified profiles</p>
                  </div>
                  <Switch
                    checked={filters.verifiedOnly}
                    onCheckedChange={(checked) => setFilters(prev => ({ ...prev, verifiedOnly: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
                  <div>
                    <p className="font-medium text-foreground">With photos</p>
                    <p className="text-sm text-muted-foreground">Only show profiles with photos</p>
                  </div>
                  <Switch
                    checked={filters.withPhotos}
                    onCheckedChange={(checked) => setFilters(prev => ({ ...prev, withPhotos: checked }))}
                  />
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="sticky bottom-0 bg-background border-t border-border p-4">
              <Button variant="gradient" className="w-full" onClick={handleApply}>
                Apply Filters
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
