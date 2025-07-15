import { useEffect, useRef, useState } from "react";
import { MapPin, Navigation, Plus, Minus, GraduationCap } from "lucide-react";

interface BusLocation {
  id: number;
  routeId: string;
  latitude: string;
  longitude: string;
  status: string;
  currentStop?: string;
  lastUpdated: string;
}

interface GoogleMapProps {
  busLocations: BusLocation[];
}

export default function GoogleMap({ busLocations }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (typeof window !== 'undefined' && !window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&libraries=places`;
        script.onload = () => setMapLoaded(true);
        document.head.appendChild(script);
      } else if (window.google) {
        setMapLoaded(true);
      }
    };

    loadGoogleMaps();
  }, []);

  useEffect(() => {
    if (mapLoaded && mapRef.current && !map) {
      const googleMap = new google.maps.Map(mapRef.current, {
        center: { lat: 12.9716, lng: 80.2707 }, // Chennai coordinates
        zoom: 12,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
      });

      // Add college marker
      new google.maps.Marker({
        position: { lat: 12.9716, lng: 80.2707 },
        map: googleMap,
        title: 'Shri Venkateshwara Padmavathy Engineering College',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: '#1e3a8a',
          fillOpacity: 1,
          strokeColor: '#f59e0b',
          strokeWeight: 3,
        },
      });

      setMap(googleMap);
    }
  }, [mapLoaded, map]);

  useEffect(() => {
    if (map && busLocations) {
      // Clear existing markers
      markers.forEach(marker => marker.setMap(null));
      
      // Add new markers
      const newMarkers = busLocations.map(location => {
        const marker = new google.maps.Marker({
          position: {
            lat: parseFloat(location.latitude),
            lng: parseFloat(location.longitude),
          },
          map: map,
          title: `Route ${location.routeId} - ${location.status}`,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: location.status === 'on_route' ? '#22c55e' : location.status === 'delayed' ? '#eab308' : '#ef4444',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="p-2">
              <h3 class="font-semibold">Route ${location.routeId}</h3>
              <p class="text-sm text-gray-600">Status: ${location.status}</p>
              ${location.currentStop ? `<p class="text-sm">Near: ${location.currentStop}</p>` : ''}
              <p class="text-xs text-gray-500">Updated: ${new Date(location.lastUpdated).toLocaleTimeString()}</p>
            </div>
          `,
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        return marker;
      });

      setMarkers(newMarkers);
    }
  }, [map, busLocations]);

  if (!mapLoaded || !window.google) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50"></div>
        
        {/* Mock bus markers */}
        <div className="absolute top-20 left-32 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
          1
        </div>
        <div className="absolute top-40 right-24 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
          2
        </div>
        <div className="absolute bottom-32 left-48 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
          4
        </div>
        
        {/* College marker */}
        <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-college-navy rounded-full flex items-center justify-center text-white">
          <GraduationCap className="w-4 h-4" />
        </div>
        
        {/* Map controls */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-sm p-2 space-y-2">
          <button className="block w-8 h-8 bg-gray-100 rounded hover:bg-gray-200 flex items-center justify-center">
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
          <button className="block w-8 h-8 bg-gray-100 rounded hover:bg-gray-200 flex items-center justify-center">
            <Minus className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Google Maps Integration</p>
            <p className="text-sm text-gray-400">Real-time bus tracking</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
