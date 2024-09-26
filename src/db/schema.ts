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
import type { AdapterAccountType } from "next-auth/adapters";

export const userRolesEnum = pgEnum("user_role", ["user", "admin"]);

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  password: varchar("password"),
  role: userRolesEnum("role").default("user"),
  isTwoFactorEnabled: boolean("is_two_factor_enabled").default(false),
  // twoFactorConfirmation: text("two_factor_confirmation"),
});

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
  (table) => {
    return {
      uniqueEmailToken: unique("unique_email_verification_token").on(
        table.email,
        table.token
      ),
    };
  }
);

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
  (table) => {
    return {
      uniqueEmailToken: unique("unique_email_password_token").on(
        table.email,
        table.token
      ),
    };
  }
);

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
  (table) => {
    return {
      uniqueEmailToken: unique("unique_email_two_factor_token").on(
        table.email,
        table.token
      ),
    };
  }
);

export const twoFactorConfirmation = pgTable(
  "two_factor_confirmation",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("userId").references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => {
    return {
      uniqueUserId: unique("unique_user_two_factor_confirmation").on(
        table.userId
      ),
    };
  }
);
