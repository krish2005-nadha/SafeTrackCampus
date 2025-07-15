import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface RouteCardProps {
  route: {
    id: string;
    name: string;
    description: string;
    totalStops: number;
    isActive: boolean;
  };
  busLocation?: {
    id: number;
    routeId: string;
    status: string;
    currentStop?: string;
    lastUpdated: string;
  };
  onViewDetails: () => void;
}

export default function RouteCard({ route, busLocation, onViewDetails }: RouteCardProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'on_route':
        return 'text-green-600';
      case 'delayed':
        return 'text-yellow-600';
      case 'stopped':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'on_route':
        return 'On Route';
      case 'delayed':
        return 'Delayed';
      case 'stopped':
        return 'Stopped';
      default:
        return 'Offline';
    }
  };

  const getStatusDot = (status?: string) => {
    switch (status) {
      case 'on_route':
        return 'bg-green-500 animate-pulse';
      case 'delayed':
        return 'bg-yellow-500';
      case 'stopped':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getCardBorder = (status?: string) => {
    switch (status) {
      case 'on_route':
        return 'border-green-200';
      case 'delayed':
        return 'border-yellow-200';
      case 'stopped':
        return 'border-red-200';
      default:
        return 'border-gray-200';
    }
  };

  return (
    <Card className={`hover:shadow-md transition-shadow border-2 ${getCardBorder(busLocation?.status)}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              busLocation?.status === 'on_route' ? 'bg-green-100' : 
              busLocation?.status === 'delayed' ? 'bg-yellow-100' : 
              busLocation?.status === 'stopped' ? 'bg-red-100' : 'bg-gray-100'
            }`}>
              <span className={`font-bold ${
                busLocation?.status === 'on_route' ? 'text-green-600' : 
                busLocation?.status === 'delayed' ? 'text-yellow-600' : 
                busLocation?.status === 'stopped' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {route.id}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{route.name}</h3>
              <p className="text-sm text-gray-600">{route.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${getStatusDot(busLocation?.status)}`}></div>
            <span className={`text-sm font-medium ${getStatusColor(busLocation?.status)}`}>
              {getStatusText(busLocation?.status)}
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              {busLocation?.status === 'on_route' ? 'Current Area:' : 'Last Known:'}
            </span>
            <span className="font-medium">
              {busLocation?.currentStop || 'Not Available'}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Status:</span>
            <span className={`font-medium ${getStatusColor(busLocation?.status)}`}>
              {getStatusText(busLocation?.status)}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Stops:</span>
            <span className="font-medium">{route.totalStops}</span>
          </div>
          
          {busLocation && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Last Updated:</span>
              <span className="font-medium text-xs">
                {new Date(busLocation.lastUpdated).toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>
        
        <Button 
          onClick={onViewDetails}
          className="w-full mt-4 bg-college-blue hover:bg-blue-600"
          disabled={!busLocation}
        >
          View Route Details
        </Button>
      </CardContent>
    </Card>
  );
}
