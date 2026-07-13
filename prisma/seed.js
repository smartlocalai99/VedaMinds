const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {

  // Create Roles
  const superAdminRole = await prisma.role.upsert({
    where: { name: "SUPER_ADMIN" },
    update: {},
    create: {
      name: "SUPER_ADMIN",
      description: "System Super Admin",
    },
  });

  await prisma.role.upsert({
    where: { name: "AGENT" },
    update: {},
    create: {
      name: "AGENT",
      description: "Agent",
    },
  });

  await prisma.role.upsert({
    where: { name: "VENDOR" },
    update: {},
    create: {
      name: "VENDOR",
      description: "Vendor",
    },
  });

  // ===============================
// CREATE PERMISSIONS
// ===============================

const permissions = [
  { name: "USER_CREATE", description: "Create Users" },
  { name: "USER_VIEW", description: "View Users" },
  { name: "USER_EDIT", description: "Edit Users" },
  { name: "USER_DELETE", description: "Delete Users" },

  { name: "AGENT_CREATE", description: "Create Agents" },
  { name: "AGENT_VIEW", description: "View Agents" },
  { name: "AGENT_EDIT", description: "Edit Agents" },
  { name: "AGENT_DELETE", description: "Delete Agents" },

  { name: "VENDOR_CREATE", description: "Create Vendors" },
  { name: "VENDOR_VIEW", description: "View Vendors" },
  { name: "VENDOR_EDIT", description: "Edit Vendors" },
  { name: "VENDOR_DELETE", description: "Delete Vendors" },

  { name: "MEMBERSHIP_CREATE", description: "Create Membership" },
  { name: "MEMBERSHIP_VIEW", description: "View Membership" },
  { name: "MEMBERSHIP_EDIT", description: "Edit Membership" },
  { name: "MEMBERSHIP_DELETE", description: "Delete Membership" },

  { name: "TRANSACTION_VIEW", description: "View Transactions" },

  { name: "DASHBOARD_VIEW", description: "View Dashboard" },
];

for (const permission of permissions) {
  await prisma.permission.upsert({
    where: {
      name: permission.name,
    },
    update: {},
    create: permission,
  });
}

console.log("Permissions Seeded Successfully");

// ===============================
// ASSIGN ALL PERMISSIONS TO SUPER ADMIN
// ===============================

const allPermissions = await prisma.permission.findMany();

for (const permission of allPermissions) {
  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: superAdminRole.id,
        permissionId: permission.id,
      },
    },
    update: {},
    create: {
      roleId: superAdminRole.id,
      permissionId: permission.id,
    },
  });
}

console.log("Super Admin Permissions Assigned");

  // Check Default Admin
  const admin = await prisma.user.findUnique({
    where: {
      email: "admin@gmail.com",
    },
  });

  if (!admin) {

    const password = await bcrypt.hash("Passw0rd!", 10);

    await prisma.user.create({
  data: {
    userCode: "ADM0001",
    firstName: "Super",
    lastName: "Admin",
    email: "admin@gmail.com",
    mobile: "9999999999",
    password: password,
    roleId: superAdminRole.id,
    status: "ACTIVE",
    emailVerified: true,
  },
});

    console.log("Default Super Admin Created");
  } else {
    console.log("Default Super Admin Already Exists");
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });