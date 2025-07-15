import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, MapPin, Clock, CheckCircle } from "lucide-react";

interface RouteDetailsModalProps {
  routeId: string;
  onClose: () => void;
}

export default function RouteDetailsModal({ routeId, onClose }: RouteDetailsModalProps) {
  const { data: routeDetails, isLoading } = useQuery({
    queryKey: ["/api/routes", routeId],
    enabled: !!routeId,
  });

  const { data: busLocation } = useQuery({
    queryKey: ["/api/bus-locations", routeId],
    enabled: !!routeId,
  });

  if (isLoading) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!routeDetails) {
    return null;
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-college-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">{routeDetails.id}</span>
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  {routeDetails.name} - {routeDetails.description}
                </DialogTitle>
                <p className="text-sm text-gray-600">
                  {routeDetails.stops?.length || 0} stops • Estimated 45 minutes journey
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Route Status */}
          {busLocation && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    busLocation.status === 'on_route' ? 'bg-green-500 animate-pulse' : 
                    busLocation.status === 'delayed' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className="font-medium text-gray-900">
                    Bus is currently {busLocation.status === 'on_route' ? 'on route' : 
                    busLocation.status === 'delayed' ? 'delayed' : 'stopped'}
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                  Updated: {new Date(busLocation.lastUpdated).toLocaleTimeString()}
                </span>
              </div>
            </div>
          )}

          {/* Route Stops */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Route Stops</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {routeDetails.stops?.map((stop: any, index: number) => {
                const isCurrentStop = busLocation?.currentStop === stop.name;
                const isPassed = busLocation && index < 3; // Mock logic for passed stops
                
                return (
                  <div
                    key={stop.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      isCurrentStop
                        ? 'bg-blue-50 border-blue-200'
                        : isPassed
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        isCurrentStop
                          ? 'bg-college-blue'
                          : isPassed
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}>
                        {isCurrentStop ? (
                          <MapPin className="w-3 h-3 text-white" />
                        ) : isPassed ? (
                          <CheckCircle className="w-3 h-3 text-white" />
                        ) : (
                          <span className="text-white text-xs font-bold">{index + 1}</span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{stop.name}</div>
                        <div className="text-sm text-gray-600">
                          {isCurrentStop ? 'Current location' : 
                           isPassed ? 'Passed' : 'Upcoming'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium flex items-center space-x-1 ${
                        isCurrentStop ? 'text-college-blue' : 
                        isPassed ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        <Clock className="w-3 h-3" />
                        <span>{stop.scheduledTime || 'N/A'}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {isCurrentStop ? 'Now' : 
                         isPassed ? 'Completed' : 'Scheduled'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
