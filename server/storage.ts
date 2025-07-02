import {
  users,
  companies,
  departments,
  employees,
  customers,
  channels,
  programsMaster,
  materialMaster,
  targetAudienceMaster,
  schedulingOrders,
  schedulingOrderDetails,
  serialNumberSettings,
  logArrangement,
  type User,
  type UpsertUser,
  type Company,
  type InsertCompany,
  type Department,
  type InsertDepartment,
  type Employee,
  type InsertEmployee,
  type Customer,
  type InsertCustomer,
  type Channel,
  type InsertChannel,
  type ProgramMaster,
  type InsertProgramMaster,
  type MaterialMaster,
  type InsertMaterialMaster,
  type TargetAudience,
  type SchedulingOrder,
  type InsertSchedulingOrder,
  type SchedulingOrderDetail,
  type InsertSchedulingOrderDetail,
  type LogArrangement,
  type InsertLogArrangement,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, like, gte, lte } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Company operations
  getCompanies(): Promise<Company[]>;
  getCompany(id: number): Promise<Company | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: number, company: Partial<InsertCompany>): Promise<Company>;

  // Department operations
  getDepartments(): Promise<Department[]>;
  getDepartment(id: number): Promise<Department | undefined>;
  createDepartment(department: InsertDepartment): Promise<Department>;
  updateDepartment(id: number, department: Partial<InsertDepartment>): Promise<Department>;

  // Employee operations
  getEmployees(): Promise<Employee[]>;
  getEmployee(id: number): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: number, employee: Partial<InsertEmployee>): Promise<Employee>;

  // Customer operations
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: number): Promise<Customer | undefined>;
  getCustomersByType(type: string): Promise<Customer[]>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer>;

  // Channel operations
  getChannels(): Promise<Channel[]>;
  getChannel(id: number): Promise<Channel | undefined>;
  createChannel(channel: InsertChannel): Promise<Channel>;
  updateChannel(id: number, channel: Partial<InsertChannel>): Promise<Channel>;

  // Program operations
  getPrograms(): Promise<ProgramMaster[]>;
  getProgram(id: number): Promise<ProgramMaster | undefined>;
  getProgramsByChannel(channelId: number): Promise<ProgramMaster[]>;
  createProgram(program: InsertProgramMaster): Promise<ProgramMaster>;
  updateProgram(id: number, program: Partial<InsertProgramMaster>): Promise<ProgramMaster>;

  // Material operations
  getMaterials(): Promise<MaterialMaster[]>;
  getMaterial(id: number): Promise<MaterialMaster | undefined>;
  createMaterial(material: InsertMaterialMaster): Promise<MaterialMaster>;
  updateMaterial(id: number, material: Partial<InsertMaterialMaster>): Promise<MaterialMaster>;

  // Target Audience operations
  getTargetAudiences(): Promise<TargetAudience[]>;

  // Scheduling Order operations
  getSchedulingOrders(): Promise<SchedulingOrder[]>;
  getSchedulingOrder(id: number): Promise<SchedulingOrder | undefined>;
  createSchedulingOrder(order: InsertSchedulingOrder): Promise<SchedulingOrder>;
  updateSchedulingOrder(id: number, order: Partial<InsertSchedulingOrder>): Promise<SchedulingOrder>;
  getSchedulingOrderDetails(schedulingOrderId: number): Promise<SchedulingOrderDetail[]>;
  createSchedulingOrderDetail(detail: InsertSchedulingOrderDetail): Promise<SchedulingOrderDetail>;
  updateSchedulingOrderDetail(id: number, detail: Partial<InsertSchedulingOrderDetail>): Promise<SchedulingOrderDetail>;
  deleteSchedulingOrderDetail(id: number): Promise<void>;

  // Serial Number operations
  getNextSerialNumber(documentType: string): Promise<string>;

  // LOG Arrangement operations
  getLogArrangementByDate(date: string, channelId: number): Promise<LogArrangement[]>;
  createLogArrangement(arrangement: InsertLogArrangement): Promise<LogArrangement>;
  updateLogArrangement(id: number, arrangement: Partial<InsertLogArrangement>): Promise<LogArrangement>;
  deleteLogArrangement(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Company operations
  async getCompanies(): Promise<Company[]> {
    return await db.select().from(companies).orderBy(companies.name);
  }

  async getCompany(id: number): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.id, id));
    return company;
  }

  async createCompany(company: InsertCompany): Promise<Company> {
    const [newCompany] = await db.insert(companies).values(company).returning();
    return newCompany;
  }

  async updateCompany(id: number, company: Partial<InsertCompany>): Promise<Company> {
    const [updatedCompany] = await db
      .update(companies)
      .set({ ...company, updatedAt: new Date() })
      .where(eq(companies.id, id))
      .returning();
    return updatedCompany;
  }

  // Department operations
  async getDepartments(): Promise<Department[]> {
    return await db.select().from(departments).orderBy(departments.name);
  }

  async getDepartment(id: number): Promise<Department | undefined> {
    const [department] = await db.select().from(departments).where(eq(departments.id, id));
    return department;
  }

  async createDepartment(department: InsertDepartment): Promise<Department> {
    const [newDepartment] = await db.insert(departments).values(department).returning();
    return newDepartment;
  }

  async updateDepartment(id: number, department: Partial<InsertDepartment>): Promise<Department> {
    const [updatedDepartment] = await db
      .update(departments)
      .set({ ...department, updatedAt: new Date() })
      .where(eq(departments.id, id))
      .returning();
    return updatedDepartment;
  }

  // Employee operations
  async getEmployees(): Promise<Employee[]> {
    return await db.select().from(employees).orderBy(employees.name);
  }

  async getEmployee(id: number): Promise<Employee | undefined> {
    const [employee] = await db.select().from(employees).where(eq(employees.id, id));
    return employee;
  }

  async createEmployee(employee: InsertEmployee): Promise<Employee> {
    const [newEmployee] = await db.insert(employees).values(employee).returning();
    return newEmployee;
  }

  async updateEmployee(id: number, employee: Partial<InsertEmployee>): Promise<Employee> {
    const [updatedEmployee] = await db
      .update(employees)
      .set({ ...employee, updatedAt: new Date() })
      .where(eq(employees.id, id))
      .returning();
    return updatedEmployee;
  }

  // Customer operations
  async getCustomers(): Promise<Customer[]> {
    return await db.select().from(customers).orderBy(customers.name);
  }

  async getCustomer(id: number): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer;
  }

  async getCustomersByType(type: string): Promise<Customer[]> {
    return await db.select().from(customers).where(eq(customers.type, type)).orderBy(customers.name);
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const [newCustomer] = await db.insert(customers).values(customer).returning();
    return newCustomer;
  }

  async updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer> {
    const [updatedCustomer] = await db
      .update(customers)
      .set({ ...customer, updatedAt: new Date() })
      .where(eq(customers.id, id))
      .returning();
    return updatedCustomer;
  }

  // Channel operations
  async getChannels(): Promise<Channel[]> {
    return await db.select().from(channels).orderBy(channels.displayOrder, channels.name);
  }

  async getChannel(id: number): Promise<Channel | undefined> {
    const [channel] = await db.select().from(channels).where(eq(channels.id, id));
    return channel;
  }

  async createChannel(channel: InsertChannel): Promise<Channel> {
    const [newChannel] = await db.insert(channels).values(channel).returning();
    return newChannel;
  }

  async updateChannel(id: number, channel: Partial<InsertChannel>): Promise<Channel> {
    const [updatedChannel] = await db
      .update(channels)
      .set({ ...channel, updatedAt: new Date() })
      .where(eq(channels.id, id))
      .returning();
    return updatedChannel;
  }

  // Program operations
  async getPrograms(): Promise<ProgramMaster[]> {
    return await db.select().from(programsMaster).orderBy(programsMaster.name);
  }

  async getProgram(id: number): Promise<ProgramMaster | undefined> {
    const [program] = await db.select().from(programsMaster).where(eq(programsMaster.id, id));
    return program;
  }

  async getProgramsByChannel(channelId: number): Promise<ProgramMaster[]> {
    return await db
      .select()
      .from(programsMaster)
      .where(eq(programsMaster.channelId, channelId))
      .orderBy(programsMaster.name);
  }

  async createProgram(program: InsertProgramMaster): Promise<ProgramMaster> {
    const [newProgram] = await db.insert(programsMaster).values(program).returning();
    return newProgram;
  }

  async updateProgram(id: number, program: Partial<InsertProgramMaster>): Promise<ProgramMaster> {
    const [updatedProgram] = await db
      .update(programsMaster)
      .set({ ...program, updatedAt: new Date() })
      .where(eq(programsMaster.id, id))
      .returning();
    return updatedProgram;
  }

  // Material operations
  async getMaterials(): Promise<MaterialMaster[]> {
    return await db.select().from(materialMaster).orderBy(materialMaster.name);
  }

  async getMaterial(id: number): Promise<MaterialMaster | undefined> {
    const [material] = await db.select().from(materialMaster).where(eq(materialMaster.id, id));
    return material;
  }

  async createMaterial(material: InsertMaterialMaster): Promise<MaterialMaster> {
    const [newMaterial] = await db.insert(materialMaster).values(material).returning();
    return newMaterial;
  }

  async updateMaterial(id: number, material: Partial<InsertMaterialMaster>): Promise<MaterialMaster> {
    const [updatedMaterial] = await db
      .update(materialMaster)
      .set({ ...material, updatedAt: new Date() })
      .where(eq(materialMaster.id, id))
      .returning();
    return updatedMaterial;
  }

  // Target Audience operations
  async getTargetAudiences(): Promise<TargetAudience[]> {
    return await db.select().from(targetAudienceMaster).orderBy(targetAudienceMaster.name);
  }

  // Scheduling Order operations
  async getSchedulingOrders(): Promise<SchedulingOrder[]> {
    return await db.select().from(schedulingOrders).orderBy(desc(schedulingOrders.createdAt));
  }

  async getSchedulingOrder(id: number): Promise<SchedulingOrder | undefined> {
    const [order] = await db.select().from(schedulingOrders).where(eq(schedulingOrders.id, id));
    return order;
  }

  async createSchedulingOrder(order: InsertSchedulingOrder): Promise<SchedulingOrder> {
    // Generate scheduling ID
    const schedulingId = await this.getNextSerialNumber("SCHEDULING_ORDER");
    const [newOrder] = await db
      .insert(schedulingOrders)
      .values({ ...order, schedulingId })
      .returning();
    return newOrder;
  }

  async updateSchedulingOrder(id: number, order: Partial<InsertSchedulingOrder>): Promise<SchedulingOrder> {
    const [updatedOrder] = await db
      .update(schedulingOrders)
      .set({ ...order, updatedAt: new Date() })
      .where(eq(schedulingOrders.id, id))
      .returning();
    return updatedOrder;
  }

  async getSchedulingOrderDetails(schedulingOrderId: number): Promise<SchedulingOrderDetail[]> {
    return await db
      .select()
      .from(schedulingOrderDetails)
      .where(eq(schedulingOrderDetails.schedulingOrderId, schedulingOrderId))
      .orderBy(schedulingOrderDetails.sequenceNumber);
  }

  async createSchedulingOrderDetail(detail: InsertSchedulingOrderDetail): Promise<SchedulingOrderDetail> {
    const [newDetail] = await db.insert(schedulingOrderDetails).values(detail).returning();
    return newDetail;
  }

  async updateSchedulingOrderDetail(id: number, detail: Partial<InsertSchedulingOrderDetail>): Promise<SchedulingOrderDetail> {
    const [updatedDetail] = await db
      .update(schedulingOrderDetails)
      .set({ ...detail, updatedAt: new Date() })
      .where(eq(schedulingOrderDetails.id, id))
      .returning();
    return updatedDetail;
  }

  async deleteSchedulingOrderDetail(id: number): Promise<void> {
    await db.delete(schedulingOrderDetails).where(eq(schedulingOrderDetails.id, id));
  }

  // Serial Number operations
  async getNextSerialNumber(documentType: string): Promise<string> {
    const [setting] = await db
      .select()
      .from(serialNumberSettings)
      .where(eq(serialNumberSettings.documentType, documentType));

    if (!setting) {
      // Create default setting if not exists
      const [newSetting] = await db
        .insert(serialNumberSettings)
        .values({
          documentType,
          prefix: "25",
          serialLast: 25000000,
          format: "NNNNNNNN",
          description: `Auto-generated serial for ${documentType}`,
        })
        .returning();
      
      const nextNumber = newSetting.serialLast + 1;
      await db
        .update(serialNumberSettings)
        .set({ serialLast: nextNumber, updatedAt: new Date() })
        .where(eq(serialNumberSettings.id, newSetting.id));
      
      return nextNumber.toString();
    }

    const nextNumber = setting.serialLast + 1;
    await db
      .update(serialNumberSettings)
      .set({ serialLast: nextNumber, updatedAt: new Date() })
      .where(eq(serialNumberSettings.id, setting.id));

    return nextNumber.toString();
  }

  // LOG Arrangement operations
  async getLogArrangementByDate(date: string, channelId: number): Promise<LogArrangement[]> {
    return await db
      .select()
      .from(logArrangement)
      .where(and(eq(logArrangement.scheduleDate, date), eq(logArrangement.channelId, channelId)))
      .orderBy(logArrangement.breakNumber, logArrangement.position);
  }

  async createLogArrangement(arrangement: InsertLogArrangement): Promise<LogArrangement> {
    const [newArrangement] = await db.insert(logArrangement).values(arrangement).returning();
    return newArrangement;
  }

  async updateLogArrangement(id: number, arrangement: Partial<InsertLogArrangement>): Promise<LogArrangement> {
    const [updatedArrangement] = await db
      .update(logArrangement)
      .set({ ...arrangement, updatedAt: new Date() })
      .where(eq(logArrangement.id, id))
      .returning();
    return updatedArrangement;
  }

  async deleteLogArrangement(id: number): Promise<void> {
    await db.delete(logArrangement).where(eq(logArrangement.id, id));
  }
}

export const storage = new DatabaseStorage();
