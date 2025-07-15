import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, insertBusLocationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Driver authentication
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { driverId, password } = loginSchema.parse(req.body);
      
      const driver = await storage.getDriverByDriverId(driverId);
      if (!driver || driver.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Update driver status to active
      await storage.updateDriverStatus(driverId, true);

      res.json({
        success: true,
        driver: {
          id: driver.id,
          driverId: driver.driverId,
          name: driver.name,
          routeId: driver.routeId,
        },
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Driver logout
  app.post("/api/auth/logout", async (req, res) => {
    try {
      const { driverId } = req.body;
      
      if (driverId) {
        await storage.updateDriverStatus(driverId, false);
        await storage.deleteBusLocation(driverId);
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Logout failed" });
    }
  });

  // Get all routes
  app.get("/api/routes", async (req, res) => {
    try {
      const routes = await storage.getAllRoutes();
      res.json(routes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch routes" });
    }
  });

  // Get route details with stops
  app.get("/api/routes/:id", async (req, res) => {
    try {
      const route = await storage.getRoute(req.params.id);
      if (!route) {
        return res.status(404).json({ message: "Route not found" });
      }

      const stops = await storage.getStopsByRoute(req.params.id);
      res.json({ ...route, stops });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch route details" });
    }
  });

  // Get all bus locations
  app.get("/api/bus-locations", async (req, res) => {
    try {
      const locations = await storage.getAllBusLocations();
      res.json(locations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bus locations" });
    }
  });

  // Update bus location
  app.post("/api/bus-locations", async (req, res) => {
    try {
      const locationData = insertBusLocationSchema.parse(req.body);
      const location = await storage.updateBusLocation(locationData);
      res.json(location);
    } catch (error) {
      res.status(400).json({ message: "Invalid location data" });
    }
  });

  // Get bus location by route
  app.get("/api/bus-locations/:routeId", async (req, res) => {
    try {
      const location = await storage.getBusLocationByRoute(req.params.routeId);
      if (!location) {
        return res.status(404).json({ message: "Bus location not found" });
      }
      res.json(location);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bus location" });
    }
  });

  // Stop bus location sharing
  app.delete("/api/bus-locations/:routeId", async (req, res) => {
    try {
      await storage.deleteBusLocation(req.params.routeId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to stop location sharing" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
