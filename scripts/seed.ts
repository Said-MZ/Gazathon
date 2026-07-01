import { config } from "dotenv";
import bcrypt from "bcryptjs";

config({ path: ".env.local" });
config();

const now = new Date();
const nextYear = new Date(now);
nextYear.setFullYear(now.getFullYear() + 1);

async function seed() {
  const { db } = await import("../src/db");
  const {
    Hospital,
    Medicine,
    MedicineRequest,
    Permission,
    Transaction,
    UserPermission,
    users,
  } = await import("../src/db/schema");

  const password = await bcrypt.hash("password123", 10);

  await db
    .insert(Hospital)
    .values([
      {
        id: "hospital-al-shifa",
        name: "Al-Shifa Medical Complex",
        address: "Gaza City",
        phone: "+970-8-286-0000",
        email: "info@alshifa.example",
        capacity: 700,
        specialties: ["Emergency", "Surgery", "Intensive Care"],
        status: "approved",
        submittedBy: "seed",
      },
      {
        id: "hospital-nasser",
        name: "Nasser Hospital",
        address: "Khan Yunis",
        phone: "+970-8-205-0000",
        email: "info@nasser.example",
        capacity: 350,
        specialties: ["Pediatrics", "Emergency", "Orthopedics"],
        status: "approved",
        submittedBy: "seed",
      },
      {
        id: "hospital-al-aqsa",
        name: "Al-Aqsa Martyrs Hospital",
        address: "Deir al-Balah",
        phone: "+970-8-253-0000",
        email: "info@alaqsa.example",
        capacity: 220,
        specialties: ["Emergency", "Internal Medicine"],
        status: "pending",
        submittedBy: "seed",
      },
    ])
    .onConflictDoNothing();

  await db
    .insert(users)
    .values([
      {
        id: "user-admin-seed",
        name: "Demo Admin",
        email: "admin@gazadon.local",
        emailVerified: now,
        password,
        role: "admin",
        hospitalRole: "Coordinator",
        hospitalId: "hospital-al-shifa",
      },
      {
        id: "user-hospital-seed",
        name: "Demo Hospital User",
        email: "user@gazadon.local",
        emailVerified: now,
        password,
        role: "user",
        hospitalRole: "Inventory Manager",
        hospitalId: "hospital-nasser",
      },
    ])
    .onConflictDoNothing();

  await db
    .insert(Permission)
    .values([
      { id: "permission-manage-hospitals", name: "manage:hospitals", description: "Create and approve hospitals" },
      { id: "permission-manage-medicines", name: "manage:medicines", description: "Create and update medicine inventory" },
      { id: "permission-view-dashboard", name: "view:dashboard", description: "View dashboard data" },
    ])
    .onConflictDoNothing();

  await db
    .insert(UserPermission)
    .values([
      { userId: "user-admin-seed", permissionId: "permission-manage-hospitals" },
      { userId: "user-admin-seed", permissionId: "permission-manage-medicines" },
      { userId: "user-admin-seed", permissionId: "permission-view-dashboard" },
      { userId: "user-hospital-seed", permissionId: "permission-view-dashboard" },
    ])
    .onConflictDoNothing();

  await db
    .insert(Medicine)
    .values([
      {
        id: "medicine-paracetamol",
        name: "Paracetamol",
        description: "Pain relief and fever reducer",
        genericName: "Acetaminophen",
        dosage: "500mg",
        form: "tablet",
        price: 2,
        stock: 1200,
        minStock: 250,
        expirationDate: nextYear,
        batchNumber: "PCM-SEED-001",
        hospitalId: "hospital-al-shifa",
      },
      {
        id: "medicine-amoxicillin",
        name: "Amoxicillin",
        description: "Broad-spectrum antibiotic",
        genericName: "Amoxicillin",
        dosage: "250mg/5ml",
        form: "suspension",
        price: 8,
        stock: 180,
        minStock: 200,
        expirationDate: nextYear,
        batchNumber: "AMX-SEED-001",
        hospitalId: "hospital-nasser",
      },
      {
        id: "medicine-saline",
        name: "Normal Saline",
        description: "IV fluid for hydration and dilution",
        genericName: "Sodium Chloride 0.9%",
        dosage: "500ml",
        form: "injection",
        price: 4,
        stock: 85,
        minStock: 150,
        expirationDate: nextYear,
        batchNumber: "SAL-SEED-001",
        hospitalId: "hospital-al-shifa",
      },
    ])
    .onConflictDoNothing();

  await db
    .insert(Transaction)
    .values([
      { id: "transaction-paracetamol-stock", medicineId: "medicine-paracetamol", quantity: 1200, type: "increase", reason: "Seed opening stock", performedBy: "user-admin-seed" },
      { id: "transaction-amoxicillin-stock", medicineId: "medicine-amoxicillin", quantity: 180, type: "increase", reason: "Seed opening stock", performedBy: "user-admin-seed" },
    ])
    .onConflictDoNothing();

  await db
    .insert(MedicineRequest)
    .values([
      {
        id: "request-saline-nasser",
        requestingHospitalId: "hospital-nasser",
        providingHospitalId: "hospital-al-shifa",
        medicineId: "medicine-saline",
        quantity: 40,
        status: "pending",
        notes: "Demo request for low IV fluid stock.",
      },
    ])
    .onConflictDoNothing();

  console.log("Seed complete.");
  console.log("Admin login: admin@gazadon.local / password123");
  console.log("User login:  user@gazadon.local / password123");
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => process.exit(0));
