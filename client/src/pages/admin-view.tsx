import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Play, Pause, Square, AlertTriangle, Clock, Route } from "lucide-react";

export default function AdminView() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentDriver, setCurrentDriver] = useState<any>(null);
  const [credentials, setCredentials] = useState({ driverId: "", password: "" });
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [locationInterval, setLocationInterval] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: routes } = useQuery({
    queryKey: ["/api/routes"],
    enabled: isAuthenticated,
  });

  const { data: routeDetails } = useQuery({
    queryKey: ["/api/routes", currentDriver?.routeId],
    enabled: isAuthenticated && !!currentDriver?.routeId,
  });

  const { data: busLocation } = useQuery({
    queryKey: ["/api/bus-locations", currentDriver?.routeId],
    enabled: isAuthenticated && !!currentDriver?.routeId,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { driverId: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", credentials);
      return response.json();
    },
    onSuccess: (data) => {
      setIsAuthenticated(true);
      setCurrentDriver(data.driver);
      toast({
        title: "Login Successful",
        description: `Welcome, ${data.driver.name}`,
      });
    },
    onError: () => {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout", { driverId: currentDriver?.driverId });
    },
    onSuccess: () => {
      if (locationInterval) {
        clearInterval(locationInterval);
        setLocationInterval(null);
      }
      setIsAuthenticated(false);
      setCurrentDriver(null);
      setIsSharing(false);
      setCurrentLocation(null);
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully.",
      });
    },
  });

  const updateLocationMutation = useMutation({
    mutationFn: async (locationData: any) => {
      const response = await apiRequest("POST", "/api/bus-locations", locationData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bus-locations"] });
      toast({
        title: "Location Updated",
        description: "Your location has been shared with students.",
      });
    },
  });

  const stopSharingMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/bus-locations/${currentDriver?.routeId}`);
    },
    onSuccess: () => {
      setIsSharing(false);
      queryClient.invalidateQueries({ queryKey: ["/api/bus-locations"] });
      toast({
        title: "Stopped Sharing",
        description: "Location sharing has been stopped.",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(credentials);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Unable to get your current location.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Location Not Supported",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive",
      });
    }
  };

  const startSharing = () => {
    if ("geolocation" in navigator) {
      // Initial location share
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationData = {
            routeId: currentDriver?.routeId,
            driverId: currentDriver?.driverId,
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            status: "on_route",
          };
          updateLocationMutation.mutate(locationData);
          setIsSharing(true);
          setCurrentLocation({ lat: latitude, lng: longitude });
          
          // Start continuous location sharing every 30 seconds
          const interval = setInterval(() => {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                const locationData = {
                  routeId: currentDriver?.routeId,
                  driverId: currentDriver?.driverId,
                  latitude: latitude.toString(),
                  longitude: longitude.toString(),
                  status: "on_route",
                };
                updateLocationMutation.mutate(locationData);
                setCurrentLocation({ lat: latitude, lng: longitude });
              },
              (error) => {
                console.error("Location sharing error:", error);
              },
              { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
            );
          }, 30000); // Update every 30 seconds
          
          setLocationInterval(interval);
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Unable to get your current location. Please enable location services.",
            variant: "destructive",
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      toast({
        title: "Location Not Supported",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive",
      });
    }
  };

  const stopSharing = () => {
    if (locationInterval) {
      clearInterval(locationInterval);
      setLocationInterval(null);
    }
    stopSharingMutation.mutate();
  };



  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Dialog open={!isAuthenticated}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-college-navy rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Driver Authentication
                </DialogTitle>
                <p className="text-gray-600 mt-2">
                  Enter your Route ID and password to start sharing your location
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                  <p className="text-sm text-blue-800 font-medium">
                    All drivers use password: <code className="bg-blue-100 px-2 py-1 rounded">driver123</code>
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Use Route ID: 1001, 1002, 1004, 1008, 1010, 1011, 1012, 1014, 1015, or 1019
                  </p>
                </div>
              </div>
            </DialogHeader>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="driverId" className="text-sm font-medium text-gray-700">
                  Driver ID
                </Label>
                <Input
                  id="driverId"
                  type="text"
                  placeholder="Enter your driver ID"
                  value={credentials.driverId}
                  onChange={(e) => setCredentials({ ...credentials, driverId: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-college-blue hover:bg-blue-600"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Driver Info Header */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-college-navy rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Welcome, {currentDriver?.name}
                </h2>
                <p className="text-gray-600">
                  {routes?.find((r: any) => r.id === currentDriver?.routeId)?.name} - {routes?.find((r: any) => r.id === currentDriver?.routeId)?.description}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">Status</div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isSharing ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                  <span className={`font-medium ${isSharing ? 'text-green-600' : 'text-gray-600'}`}>
                    {isSharing ? 'Sharing' : 'Offline'}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700"
              >
                Logout
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Sharing Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Location Sharing</span>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isSharing ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className={`text-sm ${isSharing ? 'text-green-600' : 'text-gray-600'}`}>
                {isSharing ? 'Sharing Active' : 'Sharing Inactive'}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Location */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Current Location</h4>
                  <p className="text-sm text-gray-600">
                    {busLocation ? `Last updated ${new Date(busLocation.lastUpdated).toLocaleTimeString()}` : 'No location data'}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-2">Coordinates</div>
                <div className="font-mono text-sm">
                  {busLocation ? `${busLocation.latitude}° N, ${busLocation.longitude}° E` : 'No coordinates available'}
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  {busLocation?.currentStop ? `Near: ${busLocation.currentStop}` : 'Location not shared'}
                </div>
              </div>
            </div>

            {/* Location Controls */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Sharing Controls</h4>
                  <p className="text-sm text-gray-600">Manage location visibility</p>
                </div>
              </div>
              <div className="space-y-3">
                <Button
                  onClick={startSharing}
                  disabled={isSharing}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Sharing Location
                </Button>
                <Button
                  onClick={stopSharing}
                  disabled={!isSharing}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Stop Sharing
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Route Management */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Route Management</span>
            <Select value={currentDriver?.routeId} disabled>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {routes?.map((route: any) => (
                  <SelectItem key={route.id} value={route.id}>
                    {route.name} - {route.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {routeDetails && (
            <>
              {/* Route Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Route Progress</span>
                  <span>Tracking active for {routeDetails.stops?.length || 0} stops</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-college-blue h-2 rounded-full" style={{ width: isSharing ? '36%' : '0%' }}></div>
                </div>
              </div>

              {/* Next Stops */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Route Stops</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {routeDetails.stops?.slice(0, 5).map((stop: any, index: number) => (
                    <div
                      key={stop.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        index === 0 && isSharing
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          index === 0 && isSharing ? 'bg-college-blue' : 'bg-gray-400'
                        }`}>
                          <span className="text-white text-xs font-bold">{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{stop.name}</div>
                          <div className="text-sm text-gray-600">
                            {index === 0 && isSharing ? 'Current area' : 'Upcoming'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          index === 0 && isSharing ? 'text-college-blue' : 'text-gray-600'
                        }`}>
                          {stop.scheduledTime}
                        </div>
                        <div className="text-xs text-gray-500">
                          {index === 0 && isSharing ? 'On route' : 'Scheduled'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Emergency</h4>
                <p className="text-sm text-gray-600">Alert management</p>
              </div>
            </div>
            <Button className="w-full bg-red-600 hover:bg-red-700">
              Send Alert
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Delay</h4>
                <p className="text-sm text-gray-600">Report delay</p>
              </div>
            </div>
            <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
              Report Delay
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Route className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Route</h4>
                <p className="text-sm text-gray-600">View full route</p>
              </div>
            </div>
            <Button className="w-full bg-college-blue hover:bg-blue-600">
              View Route
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
