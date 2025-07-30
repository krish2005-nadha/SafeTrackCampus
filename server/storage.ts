import { drivers, routes, stops, busLocations, type Driver, type InsertDriver, type Route, type InsertRoute, type Stop, type InsertStop, type BusLocation, type InsertBusLocation } from "@shared/schema";

export interface IStorage {
  // Driver operations
  getDriver(id: number): Promise<Driver | undefined>;
  getDriverByDriverId(driverId: string): Promise<Driver | undefined>;
  createDriver(driver: InsertDriver): Promise<Driver>;
  updateDriverStatus(driverId: string, isActive: boolean): Promise<Driver | undefined>;
  
  // Route operations
  getRoute(id: string): Promise<Route | undefined>;
  getAllRoutes(): Promise<Route[]>;
  createRoute(route: InsertRoute): Promise<Route>;
  updateRouteStatus(routeId: string, isActive: boolean): Promise<Route | undefined>;
  
  // Stop operations
  getStopsByRoute(routeId: string): Promise<Stop[]>;
  createStop(stop: InsertStop): Promise<Stop>;
  
  // Bus location operations
  getBusLocationByRoute(routeId: string): Promise<BusLocation | undefined>;
  getAllBusLocations(): Promise<BusLocation[]>;
  updateBusLocation(location: InsertBusLocation): Promise<BusLocation>;
  deleteBusLocation(routeId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private drivers: Map<number, Driver> = new Map();
  private routes: Map<string, Route> = new Map();
  private stops: Map<string, Stop[]> = new Map();
  private busLocations: Map<string, BusLocation> = new Map();
  private currentDriverId: number = 1;
  private currentStopId: number = 1;
  private currentLocationId: number = 1;

  constructor() {
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize routes
    const routeData = [
      { id: "1", name: "Route 1", description: "Prince School", totalStops: 22 },
      { id: "2", name: "Route 2", description: "Perungudi", totalStops: 16 },
      { id: "4", name: "Route 4", description: "Thiruvottriyur", totalStops: 28 },
      { id: "8", name: "Route 8", description: "Pallavaram", totalStops: 18 },
      { id: "10", name: "Route 10", description: "Mannivakkam", totalStops: 23 },
      { id: "11", name: "Route 11", description: "Chengalpattu", totalStops: 16 },
      { id: "12", name: "Route 12", description: "Liberty-Kodambakkam", totalStops: 26 },
      { id: "14", name: "Route 14", description: "Kundrathur", totalStops: 19 },
      { id: "15", name: "Route 15", description: "Pattabiram", totalStops: 24 },
      { id: "19", name: "Route 19", description: "Red Hills", totalStops: 18 },
    ];

    routeData.forEach(route => {
      this.routes.set(route.id, { ...route, isActive: true });
    });

    // Initialize drivers - All drivers use the same password "driver123"
    const driverData = [
      { driverId: "1001", password: "princedriver123", name: "Route 1 Driver", routeId: "1" },
      { driverId: "1002", password: "princedriver123", name: "Route 2 Driver", routeId: "2" },
      { driverId: "1004", password: "princedriver123", name: "Route 4 Driver", routeId: "4" },
      { driverId: "1008", password: "princedriver123", name: "Route 8 Driver", routeId: "8" },
      { driverId: "1010", password: "princedriver123", name: "Route 10 Driver", routeId: "10" },
      { driverId: "1011", password: "princedriver123", name: "Route 11 Driver", routeId: "11" },
      { driverId: "1012", password: "princedriver123", name: "Route 12 Driver", routeId: "12" },
      { driverId: "1014", password: "princedriver123", name: "Route 14 Driver", routeId: "14" },
      { driverId: "1015", password: "princedriver123", name: "Route 15 Driver", routeId: "15" },
      { driverId: "1019", password: "princedriver123", name: "Route 19 Driver", routeId: "19" },
    ];

    driverData.forEach(driver => {
      const id = this.currentDriverId++;
      this.drivers.set(id, { ...driver, id, isActive: false });
    });

    // Initialize stops for each route
    this.initializeStops();
  }

  private initializeStops() {
    const stopsData = {
      "1": [
        { name: "PRINCE SCHOOL", time: "7:20" },
        { name: "MADIPAKKAM KOOT ROAD", time: "7:22" },
        { name: "MOOVARASAMPET KULAM", time: "7:24" },
        { name: "EZHURAMMAN KOIL", time: "7:26" },
        { name: "JK MAHAL", time: "7:28" },
        { name: "BHUVANESESWARI AMMAN TEMPLE (NANGANALLUR)", time: "7:30" },
        { name: "RENGA THEATRE", time: "7:32" },
        { name: "INDEPENDENCE DAY PARK", time: "7:34" },
        { name: "ROJA MEDICAL SHOP, NANGANALLUR", time: "7:36" },
        { name: "PILLAIYAR TEMPLE, NANGANALLUR", time: "7:38" },
        { name: "KARUMARI AMMAN KOVIL", time: "7:40" },
        { name: "JEYALAKSHMI THEATRE", time: "7:42" },
        { name: "MOUNT RAILWAY STATION", time: "7:44" },
        { name: "NGO COLONY", time: "7:46" },
        { name: "KAKKAN BRIDGE", time: "7:48" },
        { name: "BRINDAVANAM NAGAR", time: "7:50" },
        { name: "PRIME CARE HOSPITAL", time: "7:52" },
        { name: "PUZHUTHIVAKKAM POLICE BOOTH", time: "7:54" },
        { name: "PALLIKARANAI POLICE BOOTH", time: "8:15" },
        { name: "PALLIKARANAI OIL MILL", time: "8:20" },
        { name: "MEDAVAKKAM VIJAYANAGARAM", time: "8:25" },
        { name: "COLLEGE", time: "" },
      ],
      "2": [
        { name: "SRP TOOLS", time: "7:30" },
        { name: "PERUNGUDI", time: "7:33" },
        { name: "KANTHANCHAVADI POORVIKA MOBILES", time: "7:35" },
        { name: "TARAMANI", time: "7:40" },
        { name: "TCS", time: "7:43" },
        { name: "BABY NAGAR", time: "7:45" },
        { name: "TANSI NAGAR", time: "7:48" },
        { name: "VELACHERY VIJAYANAGAR BUS STOP", time: "7:53" },
        { name: "A2B - 200 FEET RADIAL ROAD", time: "8:05" },
        { name: "ZONE HOTEL – VINAYAGAPURAM (S KOLATHUR)", time: "8:10" },
        { name: "RANI MAHAL", time: "8:13" },
        { name: "VEERAMANI NAGAR", time: "8:15" },
        { name: "VADAKUPATTU", time: "8:18" },
        { name: "VELLAKAL", time: "8:20" },
        { name: "BHEL NAGAR (Sri Baktha Anjaneya Temple)", time: "8:25" },
        { name: "COLLEGE", time: "" },
      ]
    };

    Object.entries(stopsData).forEach(([routeId, stops]) => {
      const routeStops = stops.map((stop, index) => ({
        id: this.currentStopId++,
        routeId,
        name: stop.name,
        scheduledTime: stop.time,
        sequence: index + 1,
      }));
      this.stops.set(routeId, routeStops);
    });
  }

  async getDriver(id: number): Promise<Driver | undefined> {
    return this.drivers.get(id);
  }

  async getDriverByDriverId(driverId: string): Promise<Driver | undefined> {
    return Array.from(this.drivers.values()).find(driver => driver.driverId === driverId);
  }

  async createDriver(driver: InsertDriver): Promise<Driver> {
    const id = this.currentDriverId++;
    const newDriver: Driver = { ...driver, id, isActive: false };
    this.drivers.set(id, newDriver);
    return newDriver;
  }

  async updateDriverStatus(driverId: string, isActive: boolean): Promise<Driver | undefined> {
    const driver = await this.getDriverByDriverId(driverId);
    if (driver) {
      driver.isActive = isActive;
      this.drivers.set(driver.id, driver);
    }
    return driver;
  }

  async getRoute(id: string): Promise<Route | undefined> {
    return this.routes.get(id);
  }

  async getAllRoutes(): Promise<Route[]> {
    return Array.from(this.routes.values());
  }

  async createRoute(route: InsertRoute): Promise<Route> {
    const newRoute: Route = { ...route, isActive: true };
    this.routes.set(route.id, newRoute);
    return newRoute;
  }

  async updateRouteStatus(routeId: string, isActive: boolean): Promise<Route | undefined> {
    const route = this.routes.get(routeId);
    if (route) {
      route.isActive = isActive;
      this.routes.set(routeId, route);
    }
    return route;
  }

  async getStopsByRoute(routeId: string): Promise<Stop[]> {
    return this.stops.get(routeId) || [];
  }

  async createStop(stop: InsertStop): Promise<Stop> {
    const id = this.currentStopId++;
    const newStop: Stop = { ...stop, id };
    const routeStops = this.stops.get(stop.routeId) || [];
    routeStops.push(newStop);
    this.stops.set(stop.routeId, routeStops);
    return newStop;
  }

  async getBusLocationByRoute(routeId: string): Promise<BusLocation | undefined> {
    return this.busLocations.get(routeId);
  }

  async getAllBusLocations(): Promise<BusLocation[]> {
    return Array.from(this.busLocations.values());
  }

  async updateBusLocation(location: InsertBusLocation): Promise<BusLocation> {
    const id = this.currentLocationId++;
    const newLocation: BusLocation = {
      ...location,
      id,
      status: location.status || "on_route",
      currentStop: location.currentStop || null,
      lastUpdated: new Date(),
    };
    this.busLocations.set(location.routeId, newLocation);
    return newLocation;
  }

  async deleteBusLocation(routeId: string): Promise<void> {
    this.busLocations.delete(routeId);
  }
}

export const storage = new MemStorage();
