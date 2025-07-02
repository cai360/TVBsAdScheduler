import {
  pgTable,
  text,
  varchar,
  integer,
  timestamp,
  boolean,
  decimal,
  jsonb,
  serial,
  date,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Companies
export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  englishName: varchar("english_name", { length: 255 }),
  country: varchar("country", { length: 3 }).notNull(),
  address: text("address"),
  englishAddress: text("english_address"),
  city: varchar("city", { length: 100 }),
  postalCode: varchar("postal_code", { length: 20 }),
  currency: varchar("currency", { length: 3 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Departments
export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  costAttribute: varchar("cost_attribute", { length: 50 }),
  expiryDate: date("expiry_date"),
  alternativeDepartmentCode: varchar("alternative_department_code", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Employees
export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  englishName: varchar("english_name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  mobile: varchar("mobile", { length: 50 }),
  address: text("address"),
  postalCode: varchar("postal_code", { length: 20 }),
  country: varchar("country", { length: 3 }),
  departmentId: integer("department_id").references(() => departments.id),
  originalDepartmentId: integer("original_department_id").references(() => departments.id),
  category: varchar("category", { length: 20 }).default("正職"),
  loginAccount: varchar("login_account", { length: 100 }).unique(),
  startDate: date("start_date"),
  endDate: date("end_date"),
  bankCode: varchar("bank_code", { length: 10 }),
  bankAccount: varchar("bank_account", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Customers
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  englishName: varchar("english_name", { length: 255 }),
  uniformNumber: varchar("uniform_number", { length: 8 }),
  status: varchar("status", { length: 20 }).default("正常"),
  type: varchar("type", { length: 20 }).notNull(), // 1.客戶, 2.代理商
  address: text("address"),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 255 }),
  contactPerson: varchar("contact_person", { length: 255 }),
  creditLimit: decimal("credit_limit", { precision: 15, scale: 2 }),
  paymentTerms: varchar("payment_terms", { length: 50 }),
  ptTimeSlots: text("pt_time_slots"), // JSON array of time slots
  spotNumbers: text("spot_numbers"), // JSON array of spot types
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Channels
export const channels = pgTable("channels", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 6 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  shortCode: varchar("short_code", { length: 10 }),
  startTime: varchar("start_time", { length: 8 }).default("05:00:00"),
  conversionCode: varchar("conversion_code", { length: 10 }),
  agbMainCode: varchar("agb_main_code", { length: 10 }),
  schedulingSeconds: integer("scheduling_seconds").default(200),
  disabled: boolean("disabled").default(false),
  allowAdArrangement: boolean("allow_ad_arrangement").default(true),
  allowSchedulingArrangement: boolean("allow_scheduling_arrangement").default(true),
  displayOrder: integer("display_order").default(0),
  financialItemCode: varchar("financial_item_code", { length: 20 }),
  financialChannelCode: varchar("financial_channel_code", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Programs Master
export const programsMaster = pgTable("programs_master", {
  id: serial("id").primaryKey(),
  channelId: integer("channel_id").references(() => channels.id).notNull(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  isPoliticalTalkShow: boolean("is_political_talk_show").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Programs Detail
export const programsDetail = pgTable("programs_detail", {
  id: serial("id").primaryKey(),
  channelId: integer("channel_id").references(() => channels.id).notNull(),
  programMasterId: integer("program_master_id").references(() => programsMaster.id).notNull(),
  subCode: varchar("sub_code", { length: 20 }),
  subName: varchar("sub_name", { length: 255 }),
  adSeconds: integer("ad_seconds").default(600),
  bundlePrice: decimal("bundle_price", { precision: 10, scale: 2 }),
  singlePrice: decimal("single_price", { precision: 10, scale: 2 }),
  pricingGroup: varchar("pricing_group", { length: 10 }),
  commission: decimal("commission", { precision: 5, scale: 2 }),
  programSegment: varchar("program_segment", { length: 50 }),
  isLineProgram: boolean("is_line_program").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Material Master (Ad Materials)
export const materialMaster = pgTable("material_master", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  customerId: integer("customer_id").references(() => customers.id),
  agentId: integer("agent_id").references(() => customers.id),
  salespersonId: integer("salesperson_id").references(() => employees.id),
  seconds: integer("seconds").notNull(),
  materialType: varchar("material_type", { length: 20 }).notNull(), // C, I, G, 9
  category: varchar("category", { length: 50 }),
  alcoholicContent: boolean("alcoholic_content").default(false),
  applicableChannels: text("applicable_channels"), // JSON array
  startDate: date("start_date"),
  endDate: date("end_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Target Audience Master
export const targetAudienceMaster = pgTable("target_audience_master", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  ageRange: varchar("age_range", { length: 20 }),
  gender: varchar("gender", { length: 10 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Serial Number Settings
export const serialNumberSettings = pgTable("serial_number_settings", {
  id: serial("id").primaryKey(),
  documentType: varchar("document_type", { length: 50 }).notNull().unique(),
  prefix: varchar("prefix", { length: 10 }),
  serialLast: integer("serial_last").default(0),
  format: varchar("format", { length: 50 }),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Scheduling Orders (排期單)
export const schedulingOrders = pgTable("scheduling_orders", {
  id: serial("id").primaryKey(),
  schedulingId: varchar("scheduling_id", { length: 20 }).notNull().unique(),
  broadcastOrderNumber: varchar("broadcast_order_number", { length: 20 }),
  createdDate: timestamp("created_date").defaultNow(),
  createdBy: integer("created_by").references(() => employees.id),
  materialId: integer("material_id").references(() => materialMaster.id),
  customerId: integer("customer_id").references(() => customers.id),
  agentId: integer("agent_id").references(() => customers.id),
  salespersonId: integer("salesperson_id").references(() => employees.id),
  startDate: date("start_date"),
  endDate: date("end_date"),
  cprpTarget: decimal("cprp_target", { precision: 10, scale: 2 }),
  sharePercentage: decimal("share_percentage", { precision: 5, scale: 2 }),
  targetAudience: text("target_audience"), // JSON array of target audience IDs
  ptTimeSlots: text("pt_time_slots"), // JSON array
  ptPercentage: decimal("pt_percentage", { precision: 5, scale: 2 }),
  spotNumbers: text("spot_numbers"), // JSON array
  pibPercentage: decimal("pib_percentage", { precision: 5, scale: 2 }),
  confirmed: boolean("confirmed").default(false),
  auditorId: integer("auditor_id").references(() => employees.id),
  auditDate: timestamp("audit_date"),
  auditNotes: text("audit_notes"),
  broadcastOrderNotes: text("broadcast_order_notes"),
  totalAmount: decimal("total_amount", { precision: 15, scale: 2 }),
  salesTax: decimal("sales_tax", { precision: 15, scale: 2 }),
  grandTotalAmount: decimal("grand_total_amount", { precision: 15, scale: 2 }),
  avg10SecUnitPrice: decimal("avg_10_sec_unit_price", { precision: 10, scale: 2 }),
  total10SecGRP: decimal("total_10_sec_grp", { precision: 8, scale: 2 }),
  total10SecCPRP: decimal("total_10_sec_cprp", { precision: 10, scale: 2 }),
  schedulingNotes: text("scheduling_notes"),
  companyConditionsDifferences: text("company_conditions_differences"),
  monthlyAmount: jsonb("monthly_amount"), // {"2025/06": 345000}
  scheduleTvrSelectionType: varchar("schedule_tvr_selection_type", { length: 20 }),
  salesReturnedConfirmed: boolean("sales_returned_confirmed").default(false),
  clientReturnedConfirmed: boolean("client_returned_confirmed").default(false),
  broadcastLogRecipients: jsonb("broadcast_log_recipients"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Scheduling Order Details (排期單明細)
export const schedulingOrderDetails = pgTable("scheduling_order_details", {
  id: serial("id").primaryKey(),
  schedulingOrderId: integer("scheduling_order_id").references(() => schedulingOrders.id).notNull(),
  sequenceNumber: integer("sequence_number").notNull(),
  channelId: integer("channel_id").references(() => channels.id),
  programId: integer("program_id").references(() => programsMaster.id),
  tvr: decimal("tvr", { precision: 8, scale: 4 }),
  broadcastTime: varchar("broadcast_time", { length: 8 }),
  seconds: integer("seconds"),
  materialId: integer("material_id").references(() => materialMaster.id),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }),
  groupNumber: varchar("group_number", { length: 10 }),
  slotCount: integer("slot_count").default(1),
  totalSeconds: integer("total_seconds"),
  broadcastAmount: decimal("broadcast_amount", { precision: 15, scale: 2 }),
  startDateDetail: date("start_date_detail"),
  endDateDetail: date("end_date_detail"),
  notesDetail: text("notes_detail"),
  modifiedBy: integer("modified_by").references(() => employees.id),
  modifiedDate: timestamp("modified_date"),
  scheduleGridData: jsonb("schedule_grid_data"), // Date grid for scheduling
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Daily Program Schedule (每日節目播出)
export const dailyProgramSchedule = pgTable("daily_program_schedule", {
  id: serial("id").primaryKey(),
  scheduleDate: date("schedule_date").notNull(),
  channelId: integer("channel_id").references(() => channels.id).notNull(),
  programId: integer("program_id").references(() => programsMaster.id).notNull(),
  startTime: varchar("start_time", { length: 8 }).notNull(),
  endTime: varchar("end_time", { length: 8 }).notNull(),
  duration: integer("duration"), // in minutes
  episodeNumber: varchar("episode_number", { length: 20 }),
  segmentCount: integer("segment_count").default(4),
  programLength: integer("program_length"), // in minutes
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// LOG Arrangement (LOG編排)
export const logArrangement = pgTable("log_arrangement", {
  id: serial("id").primaryKey(),
  scheduleDate: date("schedule_date").notNull(),
  channelId: integer("channel_id").references(() => channels.id).notNull(),
  programId: integer("program_id").references(() => programsMaster.id).notNull(),
  breakNumber: integer("break_number").notNull(),
  materialId: integer("material_id").references(() => materialMaster.id).notNull(),
  position: integer("position").notNull(),
  seconds: integer("seconds").notNull(),
  materialType: varchar("material_type", { length: 10 }).notNull(), // C, I, G, 9
  broadcastOrderId: integer("broadcast_order_id").references(() => schedulingOrders.id),
  specialRequirements: text("special_requirements"),
  isConverted: boolean("is_converted").default(false),
  convertedAt: timestamp("converted_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const companiesRelations = relations(companies, ({ many }) => ({
  employees: many(employees),
}));

export const departmentsRelations = relations(departments, ({ many }) => ({
  employees: many(employees),
  originalEmployees: many(employees),
}));

export const employeesRelations = relations(employees, ({ one, many }) => ({
  department: one(departments, {
    fields: [employees.departmentId],
    references: [departments.id],
  }),
  originalDepartment: one(departments, {
    fields: [employees.originalDepartmentId],
    references: [departments.id],
  }),
  createdSchedulingOrders: many(schedulingOrders, { relationName: "createdBy" }),
  auditedSchedulingOrders: many(schedulingOrders, { relationName: "auditor" }),
}));

export const customersRelations = relations(customers, ({ many }) => ({
  schedulingOrdersAsCustomer: many(schedulingOrders, { relationName: "customer" }),
  schedulingOrdersAsAgent: many(schedulingOrders, { relationName: "agent" }),
  materials: many(materialMaster),
}));

export const channelsRelations = relations(channels, ({ many }) => ({
  programsMaster: many(programsMaster),
  programsDetail: many(programsDetail),
  schedulingOrderDetails: many(schedulingOrderDetails),
  dailyProgramSchedules: many(dailyProgramSchedule),
  logArrangements: many(logArrangement),
}));

export const programsMasterRelations = relations(programsMaster, ({ one, many }) => ({
  channel: one(channels, {
    fields: [programsMaster.channelId],
    references: [channels.id],
  }),
  programsDetail: many(programsDetail),
  schedulingOrderDetails: many(schedulingOrderDetails),
  dailyProgramSchedules: many(dailyProgramSchedule),
  logArrangements: many(logArrangement),
}));

export const materialMasterRelations = relations(materialMaster, ({ one, many }) => ({
  customer: one(customers, {
    fields: [materialMaster.customerId],
    references: [customers.id],
  }),
  agent: one(customers, {
    fields: [materialMaster.agentId],
    references: [customers.id],
  }),
  salesperson: one(employees, {
    fields: [materialMaster.salespersonId],
    references: [employees.id],
  }),
  schedulingOrders: many(schedulingOrders),
  schedulingOrderDetails: many(schedulingOrderDetails),
  logArrangements: many(logArrangement),
}));

export const schedulingOrdersRelations = relations(schedulingOrders, ({ one, many }) => ({
  createdBy: one(employees, {
    fields: [schedulingOrders.createdBy],
    references: [employees.id],
    relationName: "createdBy",
  }),
  auditor: one(employees, {
    fields: [schedulingOrders.auditorId],
    references: [employees.id],
    relationName: "auditor",
  }),
  material: one(materialMaster, {
    fields: [schedulingOrders.materialId],
    references: [materialMaster.id],
  }),
  customer: one(customers, {
    fields: [schedulingOrders.customerId],
    references: [customers.id],
    relationName: "customer",
  }),
  agent: one(customers, {
    fields: [schedulingOrders.agentId],
    references: [customers.id],
    relationName: "agent",
  }),
  salesperson: one(employees, {
    fields: [schedulingOrders.salespersonId],
    references: [employees.id],
  }),
  details: many(schedulingOrderDetails),
  logArrangements: many(logArrangement),
}));

export const schedulingOrderDetailsRelations = relations(schedulingOrderDetails, ({ one }) => ({
  schedulingOrder: one(schedulingOrders, {
    fields: [schedulingOrderDetails.schedulingOrderId],
    references: [schedulingOrders.id],
  }),
  channel: one(channels, {
    fields: [schedulingOrderDetails.channelId],
    references: [channels.id],
  }),
  program: one(programsMaster, {
    fields: [schedulingOrderDetails.programId],
    references: [programsMaster.id],
  }),
  material: one(materialMaster, {
    fields: [schedulingOrderDetails.materialId],
    references: [materialMaster.id],
  }),
  modifiedBy: one(employees, {
    fields: [schedulingOrderDetails.modifiedBy],
    references: [employees.id],
  }),
}));

// Insert schemas
export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDepartmentSchema = createInsertSchema(departments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEmployeeSchema = createInsertSchema(employees).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChannelSchema = createInsertSchema(channels).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProgramMasterSchema = createInsertSchema(programsMaster).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMaterialMasterSchema = createInsertSchema(materialMaster).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSchedulingOrderSchema = createInsertSchema(schedulingOrders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  createdDate: true,
  schedulingId: true,
});

export const insertSchedulingOrderDetailSchema = createInsertSchema(schedulingOrderDetails).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLogArrangementSchema = createInsertSchema(logArrangement).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Company = typeof companies.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Department = typeof departments.$inferSelect;
export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;
export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Channel = typeof channels.$inferSelect;
export type InsertChannel = z.infer<typeof insertChannelSchema>;
export type ProgramMaster = typeof programsMaster.$inferSelect;
export type InsertProgramMaster = z.infer<typeof insertProgramMasterSchema>;
export type MaterialMaster = typeof materialMaster.$inferSelect;
export type InsertMaterialMaster = z.infer<typeof insertMaterialMasterSchema>;
export type TargetAudience = typeof targetAudienceMaster.$inferSelect;
export type SchedulingOrder = typeof schedulingOrders.$inferSelect;
export type InsertSchedulingOrder = z.infer<typeof insertSchedulingOrderSchema>;
export type SchedulingOrderDetail = typeof schedulingOrderDetails.$inferSelect;
export type InsertSchedulingOrderDetail = z.infer<typeof insertSchedulingOrderDetailSchema>;
export type LogArrangement = typeof logArrangement.$inferSelect;
export type InsertLogArrangement = z.infer<typeof insertLogArrangementSchema>;
