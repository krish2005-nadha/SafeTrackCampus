import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import GoogleMap from "@/components/google-map";
import RouteCard from "@/components/route-card";
import RouteDetailsModal from "@/components/route-details-modal";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function StudentView() {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: routes, isLoading: routesLoading, refetch: refetchRoutes } = useQuery({
    queryKey: ["/api/routes"],
  });

  const { data: busLocations, isLoading: locationsLoading, refetch: refetchLocations } = useQuery({
    queryKey: ["/api/bus-locations"],
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchRoutes(), refetchLocations()]);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const activeBusCount = busLocations?.length || 0;

  if (routesLoading || locationsLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-16 bg-gray-200 rounded-lg mb-8"></div>
          <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Live Status Banner */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-3"></div>
            <span className="text-green-800 font-medium">Live Tracking Active</span>
            <span className="text-green-600 ml-2">- {activeBusCount} buses currently on route</span>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            size="sm"
            className="bg-college-blue hover:bg-blue-600"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Live Bus Locations</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">On Route</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Delayed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Stopped</span>
              </div>
            </div>
          </div>
          <GoogleMap busLocations={busLocations || []} />
        </div>
      </div>

      {/* Route Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routes?.map((route: any) => {
          const busLocation = busLocations?.find((location: any) => location.routeId === route.id);
          return (
            <RouteCard
              key={route.id}
              route={route}
              busLocation={busLocation}
              onViewDetails={() => setSelectedRoute(route.id)}
            />
          );
        })}
      </div>

      {/* Route Details Modal */}
      {selectedRoute && (
        <RouteDetailsModal
          routeId={selectedRoute}
          onClose={() => setSelectedRoute(null)}
        />
      )}
    </div>
  );
}
