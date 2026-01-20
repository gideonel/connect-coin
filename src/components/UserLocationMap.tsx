import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Users, Locate, X } from 'lucide-react';
import { sampleUsers } from '@/data/sampleUsers';
import { motion, AnimatePresence } from 'framer-motion';

interface UserMarker {
  id: string;
  name: string;
  age: number;
  photo: string;
  lng: number;
  lat: number;
  distance: number;
  online: boolean;
  verified: boolean;
}

// Generate random coordinates around a center point
const generateNearbyUsers = (): UserMarker[] => {
  const centerLng = -73.985428;
  const centerLat = 40.748817;
  
  return sampleUsers.map((user, index) => ({
    id: user.id,
    name: user.name,
    age: user.age,
    photo: user.photos[0],
    lng: centerLng + (Math.random() - 0.5) * 0.1,
    lat: centerLat + (Math.random() - 0.5) * 0.1,
    distance: Math.floor(Math.random() * 10) + 1,
    online: user.online,
    verified: user.verified,
  }));
};

interface UserLocationMapProps {
  isOpen: boolean;
  onClose: () => void;
  onUserSelect?: (userId: string) => void;
}

const UserLocationMap = ({ isOpen, onClose, onUserSelect }: UserLocationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserMarker | null>(null);
  const [nearbyUsers] = useState<UserMarker[]>(generateNearbyUsers);
  const [mapLoaded, setMapLoaded] = useState(false);

  const mapboxToken = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN;

  useEffect(() => {
    if (!isOpen || !mapContainer.current || map.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-73.985428, 40.748817],
      zoom: 12,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserHeading: true,
      }),
      'top-right'
    );

    map.current.on('load', () => {
      setMapLoaded(true);
      
      // Add user markers
      nearbyUsers.forEach((user) => {
        const el = document.createElement('div');
        el.className = 'user-marker';
        el.innerHTML = `
          <div class="relative cursor-pointer transform transition-transform hover:scale-110">
            <div class="w-12 h-12 rounded-full border-3 ${user.online ? 'border-green-500' : 'border-gray-400'} overflow-hidden shadow-lg">
              <img src="${user.photo}" alt="${user.name}" class="w-full h-full object-cover" />
            </div>
            ${user.online ? '<div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>' : ''}
          </div>
        `;

        el.addEventListener('click', () => {
          setSelectedUser(user);
        });

        const marker = new mapboxgl.Marker(el)
          .setLngLat([user.lng, user.lat])
          .addTo(map.current!);

        markersRef.current.push(marker);
      });
    });

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      setMapLoaded(false);
    };
  }, [isOpen, nearbyUsers, mapboxToken]);

  const flyToUser = (user: UserMarker) => {
    if (map.current) {
      map.current.flyTo({
        center: [user.lng, user.lat],
        zoom: 15,
        essential: true,
      });
    }
    setSelectedUser(user);
  };

  const handleViewProfile = () => {
    if (selectedUser && onUserSelect) {
      onUserSelect(selectedUser.id);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background"
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-background to-transparent">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold">Nearby</h2>
                <p className="text-sm text-muted-foreground">{nearbyUsers.length} people nearby</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Map Container */}
        <div ref={mapContainer} className="w-full h-full" />

        {!mapboxToken && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Card className="max-w-md mx-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Mapbox Token Required
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Please add your Mapbox public token to enable the map feature.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Nearby Users List */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {nearbyUsers.slice(0, 6).map((user) => (
                <motion.div
                  key={user.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => flyToUser(user)}
                  className={`flex-shrink-0 cursor-pointer p-3 rounded-xl bg-card border transition-colors ${
                    selectedUser?.id === user.id ? 'border-primary' : 'border-border'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={user.photo}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {user.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{user.name}, {user.age}</span>
                        {user.verified && (
                          <Badge variant="secondary" className="text-xs px-1.5 py-0">✓</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Navigation className="w-3 h-3" />
                        <span>{user.distance} mi away</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected User Card */}
        <AnimatePresence>
          {selectedUser && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute top-20 left-4 right-4 z-10 max-w-sm mx-auto"
            >
              <Card className="overflow-hidden">
                <div className="relative h-32">
                  <img
                    src={selectedUser.photo}
                    alt={selectedUser.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-white"
                    onClick={() => setSelectedUser(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{selectedUser.name}, {selectedUser.age}</h3>
                        {selectedUser.verified && (
                          <Badge variant="secondary" className="text-xs">Verified</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Navigation className="w-3 h-3" />
                        <span>{selectedUser.distance} miles away</span>
                        {selectedUser.online && (
                          <Badge variant="outline" className="ml-2 text-green-500 border-green-500 text-xs">
                            Online
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="gradient" className="flex-1" onClick={handleViewProfile}>
                      View Profile
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedUser(null)}>
                      Close
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Overlay */}
        <div className="absolute top-20 right-4 z-10">
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-primary" />
                <span>{nearbyUsers.filter(u => u.online).length} online nearby</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UserLocationMap;
