import { PrismaClient } from "../src/generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const connectionString = "postgresql://postgres:salem@127.0.0.1:5432/mforu_app?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting seed...");

  console.log("🗑️  Clearing existing data...");
  await prisma.expense.deleteMany();
  await prisma.debt.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.subTask.deleteMany();
  await prisma.serviceAction.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.client.deleteMany();
  await prisma.categories.deleteMany();
  await prisma.user.deleteMany();
  await prisma.salon.deleteMany();
  await prisma.roleTable.deleteMany();

  console.log("📂 Creating categories...");
  await prisma.categories.create({ data: { cat_name: "قص الشعر" } });
  await prisma.categories.create({ data: { cat_name: "الصبغة" } });
  await prisma.categories.create({ data: { cat_name: "العناية بالبشرة" } });
  await prisma.categories.create({ data: { cat_name: "المكياج" } });
  await prisma.categories.create({ data: { cat_name: "الأظافر" } });
  await prisma.categories.create({ data: { cat_name: "الحلاقة" } });
  console.log("✅ Created 6 categories");

  console.log("👥 Creating roles...");
  const adminRole = await prisma.roleTable.create({ data: { role_name: "admin of system" } });
  const accountingRole = await prisma.roleTable.create({ data: { role_name: "accounting man" } });
  const ownerRole = await prisma.roleTable.create({ data: { role_name: "salon owner" } });
  const receptionRole = await prisma.roleTable.create({ data: { role_name: "reception" } });
  console.log("✅ Created 4 roles");

  console.log("👨‍💼 Creating system admin...");
  await prisma.user.create({
    data: {
      name: "System Administrator",
      phone: "0500000001",
      password: await bcrypt.hash("admin123", 10),
      role_id: adminRole.role_id,
      status: "ACTIVE",
    },
  });

  console.log("�� Creating salons with owners...");
  const owner1 = await prisma.user.create({
    data: {
      name: "أحمد محمد",
      phone: "0501234567",
      password: await bcrypt.hash("owner123", 10),
      role_id: ownerRole.role_id,
      status: "ACTIVE",
    },
  });

  const salon1 = await prisma.salon.create({
    data: {
      name: "صالون الجمال",
      site: "الرياض - حي النخيل",
      owner_id: owner1.user_id,
    },
  });

  const owner2 = await prisma.user.create({
    data: {
      name: "Sarah Abdullah",
      phone: "0559876543",
      password: await bcrypt.hash("owner456", 10),
      role_id: ownerRole.role_id,
      status: "ACTIVE",
    },
  });

  const salon2 = await prisma.salon.create({
    data: {
      name: "Beauty Lounge",
      site: "Jeddah - Al Hamra",
      owner_id: owner2.user_id,
    },
  });

  console.log("📞 Creating reception users...");
  await prisma.user.create({
    data: {
      name: "فاطمة علي",
      phone: "0551112233",
      password: await bcrypt.hash("reception123", 10),
      role_id: receptionRole.role_id,
      status: "ACTIVE",
      salon_id: salon1.salon_id,
    },
  });

  await prisma.user.create({
    data: {
      name: "Mona Ali",
      phone: "0554445566",
      password: await bcrypt.hash("reception456", 10),
      role_id: receptionRole.role_id,
      status: "ACTIVE",
      salon_id: salon2.salon_id,
    },
  });

  console.log("💰 Creating accounting user...");
  await prisma.user.create({
    data: {
      name: "خالد العتيبي",
      phone: "0557778899",
      password: await bcrypt.hash("accounting123", 10),
      role_id: accountingRole.role_id,
      status: "ACTIVE",
    },
  });

  console.log("💇 Creating employees...");
  await prisma.employee.create({ data: { emp_name: "محمد أحمد", role: "حلاق", field: "قص شعر", salon_id: salon1.salon_id } });
  await prisma.employee.create({ data: { emp_name: "نورة سعيد", role: "مصففة شعر", field: "تسريحات", salon_id: salon1.salon_id } });
  await prisma.employee.create({ data: { emp_name: "John Smith", role: "Barber", field: "Hair Cut", salon_id: salon2.salon_id } });

  console.log("👥 Creating clients...");
  await prisma.client.create({ data: { name: "عبدالله محمد", phone: "0501111111", notes: "يفضل القص القصير" } });
  await prisma.client.create({ data: { name: "سارة أحمد", phone: "0502222222", notes: "حساسية من بعض المنتجات" } });
  await prisma.client.create({ data: { name: "Mike Johnson", phone: "0503333333", notes: "Regular customer" } });

  console.log("\n✨ Seed completed!");
  console.log("📊 Summary: 6 categories, 4 roles, 6 users, 2 salons, 3 employees, 3 clients");
  console.log("\n🔑 Logins:");
  console.log("Admin: 0500000001 / admin123");
  console.log("Owner1: 0501234567 / owner123");
  console.log("Owner2: 0559876543 / owner456");
  console.log("Reception1: 0551112233 / reception123");
  console.log("Reception2: 0554445566 / reception456");
  console.log("Accounting: 0557778899 / accounting123");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
