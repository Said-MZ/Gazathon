import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  varchar,
  pgEnum,
  unique,
  boolean,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import type { AdapterAccountType } from "next-auth/adapters";

// Enums
export const userRolesEnum = pgEnum("user_role", ["user", "admin"]);
export const transactionTypeEnum = pgEnum("transaction_type", [
  "increase",
  "decrease",
]);
export const requestStatusEnum = pgEnum("request_status", [
  "pending",
  "approved",
  "rejected",
  "fulfilled",
]);

export const hospitalStatusEnum = pgEnum("hospital_status", [
  "pending",
  "approved",
  "rejected",
]);

// Users
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),// remove this
  password: varchar("password"),
  role: userRolesEnum("role").default("user"),
  hospitalRole: text("hospital_role"),
  isTwoFactorEnabled: boolean("is_two_factor_enabled").default(false),
  hospitalId: text("hospital_id").references(() => Hospital.id, {
    onDelete: "cascade",
  }),
});

// Accounts (for OAuth)
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

// Verification Token
export const verificationToken = pgTable(
  "verification_token",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    email: text("email"),
    token: text("token").unique(),
    expires: timestamp("expires"),
  },
  (table) => ({
    uniqueEmailToken: unique("unique_email_verification_token").on(
      table.email,
      table.token
    ),
  })
);

// Password Reset Token
export const passwordResetToken = pgTable(
  "password_reset_token",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    email: text("email"),
    token: text("token").unique(),
    expires: timestamp("expires"),
  },
  (table) => ({
    uniqueEmailToken: unique("unique_email_password_token").on(
      table.email,
      table.token
    ),
  })
);

// Two Factor Token
export const twoFactorToken = pgTable(
  "two_factor_token",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    email: text("email"),
    token: text("token").unique(),
    expires: timestamp("expires"),
  },
  (table) => ({
    uniqueEmailToken: unique("unique_email_two_factor_token").on(
      table.email,
      table.token
    ),
  })
);

// Two Factor Confirmation
export const twoFactorConfirmation = pgTable(
  "two_factor_confirmation",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("userId").references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => ({
    uniqueUserId: unique("unique_user_two_factor_confirmation").on(
      table.userId
    ),
  })
);

// Hospital
export const Hospital = pgTable("hospital", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  capacity: integer("capacity"),
  specialties: text("specialties").array(),
  status: hospitalStatusEnum("status").default("pending"),
  submittedBy: text("submitted_by"),
  createdAt: timestamp("created_at", { mode: "date" }).default(sql`now()`),
  updatedAt: timestamp("updated_at", { mode: "date" }).default(sql`now()`),
});

// Medicine
export const Medicine = pgTable("medicine", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description"),
  genericName: text("generic_name"),
  dosage: text("dosage"),
  form: text("form"), // e.g., tablet, liquid, injection
  price: integer("price").notNull(),
  stock: integer("stock").notNull(),
  minStock: integer("min_stock"), // for low stock alerts
  expirationDate: timestamp("expiration_date", { mode: "date" }).notNull(),
  batchNumber: text("batch_number"),
  hospitalId: text("hospital_id")
    .references(() => Hospital.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).default(sql`now()`),
  updatedAt: timestamp("updated_at", { mode: "date" }).default(sql`now()`),
});

// Transaction
export const Transaction = pgTable("transaction", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  medicineId: text("medicine_id")
    .references(() => Medicine.id, { onDelete: "cascade" })
    .notNull(),
  quantity: integer("quantity").notNull(),
  type: transactionTypeEnum("type").notNull(),
  reason: text("reason"), // e.g., "new stock", "used in treatment", "expired"
  performedBy: text("performed_by").references(() => users.id),
  timestamp: timestamp("timestamp", { mode: "date" }).default(sql`now()`),
});

// Medicine Request
export const MedicineRequest = pgTable("medicine_request", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  requestingHospitalId: text("requesting_hospital_id")
    .references(() => Hospital.id)
    .notNull(),
  providingHospitalId: text("providing_hospital_id")
    .references(() => Hospital.id)
    .notNull(),
  medicineId: text("medicine_id")
    .references(() => Medicine.id)
    .notNull(),
  quantity: integer("quantity").notNull(),
  status: requestStatusEnum("status").default("pending"),
  requestedAt: timestamp("requested_at", { mode: "date" }).default(sql`now()`),
  fulfilledAt: timestamp("fulfilled_at", { mode: "date" }),
  notes: text("notes"),
});

// Permission
export const Permission = pgTable("permission", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
  description: text("description"),
});

// User Permission (junction table)
export const UserPermission = pgTable(
  "user_permission",
  {
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    permissionId: text("permission_id")
      .references(() => Permission.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.permissionId] }),
  })
);
