import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const drivers = pgTable("drivers", {
  id: serial("id").primaryKey(),
  driverId: text("driver_id").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  routeId: text("route_id").notNull(),
  isActive: boolean("is_active").default(false),
});

export const routes = pgTable("routes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  totalStops: integer("total_stops").notNull(),
  isActive: boolean("is_active").default(false),
});

export const stops = pgTable("stops", {
  id: serial("id").primaryKey(),
  routeId: text("route_id").notNull(),
  name: text("name").notNull(),
  scheduledTime: text("scheduled_time").notNull(),
  sequence: integer("sequence").notNull(),
});

export const busLocations = pgTable("bus_locations", {
  id: serial("id").primaryKey(),
  routeId: text("route_id").notNull(),
  driverId: text("driver_id").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  currentStop: text("current_stop"),
  status: text("status").notNull().default("on_route"), // on_route, delayed, stopped
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const insertDriverSchema = createInsertSchema(drivers).pick({
  driverId: true,
  password: true,
  name: true,
  routeId: true,
});

export const insertRouteSchema = createInsertSchema(routes).pick({
  id: true,
  name: true,
  description: true,
  totalStops: true,
});

export const insertStopSchema = createInsertSchema(stops).pick({
  routeId: true,
  name: true,
  scheduledTime: true,
  sequence: true,
});

export const insertBusLocationSchema = createInsertSchema(busLocations).pick({
  routeId: true,
  driverId: true,
  latitude: true,
  longitude: true,
  currentStop: true,
  status: true,
});

export const loginSchema = z.object({
  driverId: z.string().min(1, "Driver ID is required"),
  password: z.string().min(1, "Password is required"),
});

export type Driver = typeof drivers.$inferSelect;
export type InsertDriver = z.infer<typeof insertDriverSchema>;
export type Route = typeof routes.$inferSelect;
export type InsertRoute = z.infer<typeof insertRouteSchema>;
export type Stop = typeof stops.$inferSelect;
export type InsertStop = z.infer<typeof insertStopSchema>;
export type BusLocation = typeof busLocations.$inferSelect;
export type InsertBusLocation = z.infer<typeof insertBusLocationSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;
