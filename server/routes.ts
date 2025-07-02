import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertSchedulingOrderSchema,
  insertSchedulingOrderDetailSchema,
  insertLogArrangementSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard statistics
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const schedulingOrders = await storage.getSchedulingOrders();
      const channels = await storage.getChannels();
      
      // Calculate basic statistics
      const pendingOrders = schedulingOrders.filter(order => !order.confirmed).length;
      const completedLogs = 8; // This would be calculated from LOG arrangement data
      const pendingApproval = schedulingOrders.filter(order => order.confirmed && !order.auditorId).length;
      
      const monthlyRevenue = schedulingOrders
        .filter(order => order.confirmed)
        .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

      const stats = {
        pendingOrders,
        completedLogs,
        pendingApproval,
        monthlyRevenue,
        totalSeconds: 45680,
        avgCPRP: 8500,
      };

      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard statistics" });
    }
  });

  // Customers API
  app.get("/api/customers", async (req, res) => {
    try {
      const { type } = req.query;
      let customers;
      
      if (type && typeof type === 'string') {
        customers = await storage.getCustomersByType(type);
      } else {
        customers = await storage.getCustomers();
      }
      
      res.json(customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  // Employees API
  app.get("/api/employees", async (req, res) => {
    try {
      const employees = await storage.getEmployees();
      res.json(employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      res.status(500).json({ message: "Failed to fetch employees" });
    }
  });

  // Channels API
  app.get("/api/channels", async (req, res) => {
    try {
      const channels = await storage.getChannels();
      res.json(channels);
    } catch (error) {
      console.error("Error fetching channels:", error);
      res.status(500).json({ message: "Failed to fetch channels" });
    }
  });

  // Programs API
  app.get("/api/programs", async (req, res) => {
    try {
      const { channelId } = req.query;
      let programs;
      
      if (channelId && !isNaN(Number(channelId))) {
        programs = await storage.getProgramsByChannel(Number(channelId));
      } else {
        programs = await storage.getPrograms();
      }
      
      res.json(programs);
    } catch (error) {
      console.error("Error fetching programs:", error);
      res.status(500).json({ message: "Failed to fetch programs" });
    }
  });

  // Materials API
  app.get("/api/materials", async (req, res) => {
    try {
      const materials = await storage.getMaterials();
      res.json(materials);
    } catch (error) {
      console.error("Error fetching materials:", error);
      res.status(500).json({ message: "Failed to fetch materials" });
    }
  });

  // Target Audiences API
  app.get("/api/target-audiences", async (req, res) => {
    try {
      const targetAudiences = await storage.getTargetAudiences();
      res.json(targetAudiences);
    } catch (error) {
      console.error("Error fetching target audiences:", error);
      res.status(500).json({ message: "Failed to fetch target audiences" });
    }
  });

  // Scheduling Orders API
  app.get("/api/scheduling-orders", async (req, res) => {
    try {
      const orders = await storage.getSchedulingOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching scheduling orders:", error);
      res.status(500).json({ message: "Failed to fetch scheduling orders" });
    }
  });

  app.get("/api/scheduling-orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getSchedulingOrder(id);
      
      if (!order) {
        return res.status(404).json({ message: "Scheduling order not found" });
      }
      
      res.json(order);
    } catch (error) {
      console.error("Error fetching scheduling order:", error);
      res.status(500).json({ message: "Failed to fetch scheduling order" });
    }
  });

  app.post("/api/scheduling-orders", async (req, res) => {
    try {
      const validatedData = insertSchedulingOrderSchema.parse(req.body);
      const order = await storage.createSchedulingOrder(validatedData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating scheduling order:", error);
      res.status(500).json({ message: "Failed to create scheduling order" });
    }
  });

  app.put("/api/scheduling-orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertSchedulingOrderSchema.partial().parse(req.body);
      const order = await storage.updateSchedulingOrder(id, validatedData);
      res.json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error updating scheduling order:", error);
      res.status(500).json({ message: "Failed to update scheduling order" });
    }
  });

  // Scheduling Order Details API
  app.get("/api/scheduling-orders/:id/details", async (req, res) => {
    try {
      const schedulingOrderId = parseInt(req.params.id);
      const details = await storage.getSchedulingOrderDetails(schedulingOrderId);
      res.json(details);
    } catch (error) {
      console.error("Error fetching scheduling order details:", error);
      res.status(500).json({ message: "Failed to fetch scheduling order details" });
    }
  });

  app.post("/api/scheduling-orders/:id/details", async (req, res) => {
    try {
      const schedulingOrderId = parseInt(req.params.id);
      const validatedData = insertSchedulingOrderDetailSchema.parse({
        ...req.body,
        schedulingOrderId,
      });
      const detail = await storage.createSchedulingOrderDetail(validatedData);
      res.status(201).json(detail);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating scheduling order detail:", error);
      res.status(500).json({ message: "Failed to create scheduling order detail" });
    }
  });

  app.put("/api/scheduling-order-details/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertSchedulingOrderDetailSchema.partial().parse(req.body);
      const detail = await storage.updateSchedulingOrderDetail(id, validatedData);
      res.json(detail);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error updating scheduling order detail:", error);
      res.status(500).json({ message: "Failed to update scheduling order detail" });
    }
  });

  app.delete("/api/scheduling-order-details/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSchedulingOrderDetail(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting scheduling order detail:", error);
      res.status(500).json({ message: "Failed to delete scheduling order detail" });
    }
  });

  // LOG Arrangement API
  app.get("/api/log-arrangement", async (req, res) => {
    try {
      const { date, channelId } = req.query;
      
      if (!date || !channelId) {
        return res.status(400).json({ message: "Date and channelId are required" });
      }
      
      const arrangements = await storage.getLogArrangementByDate(
        date as string,
        parseInt(channelId as string)
      );
      res.json(arrangements);
    } catch (error) {
      console.error("Error fetching log arrangement:", error);
      res.status(500).json({ message: "Failed to fetch log arrangement" });
    }
  });

  app.post("/api/log-arrangement", async (req, res) => {
    try {
      const validatedData = insertLogArrangementSchema.parse(req.body);
      const arrangement = await storage.createLogArrangement(validatedData);
      res.status(201).json(arrangement);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating log arrangement:", error);
      res.status(500).json({ message: "Failed to create log arrangement" });
    }
  });

  app.put("/api/log-arrangement/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertLogArrangementSchema.partial().parse(req.body);
      const arrangement = await storage.updateLogArrangement(id, validatedData);
      res.json(arrangement);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error updating log arrangement:", error);
      res.status(500).json({ message: "Failed to update log arrangement" });
    }
  });

  app.delete("/api/log-arrangement/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteLogArrangement(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting log arrangement:", error);
      res.status(500).json({ message: "Failed to delete log arrangement" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
