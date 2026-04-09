/**
 * nexora_backend/src/scripts/seedingAdmin.ts
 *
 * Seeds the database with:
 *  1. Super Admin account
 *  2. Demo Teacher account  (credentials from .env)
 *  3. Demo Student account  (credentials from .env)
 *
 * Run with:  npm run seeding
 */

import "dotenv/config";
import { auth } from "../lib/auth.js";
import { prisma } from "../lib/prisma.js";
import { Role } from "../generated/prisma/enums.js";

// ─── Seed config ──────────────────────────────────────────────────────────────
const SEEDS = [
  {
    name: "Super Admin",
    email: process.env.SUPER_ADMIN_EMAIL ?? "admin@nexora.com",
    password: process.env.SUPER_ADMIN_PASSWORD ?? "Admin@123456",
    role: Role.ADMIN as Role,
    profile: "admin" as const,
  },
  {
    name: "Demo Teacher",
    email: process.env.DEMO_TEACHER_EMAIL ?? "heptex.project5@gmail.com",
    password: process.env.DEMO_TEACHER_PASSWORD ?? "As123456789",
    role: Role.TEACHER as Role,
    profile: "teacher" as const,
  },
  {
    name: "Demo Student",
    email: process.env.DEMO_STUDENT_EMAIL ?? "heptex.project4@gmail.com",
    password: process.env.DEMO_STUDENT_PASSWORD ?? "As123456789",
    role: Role.STUDENT as Role,
    profile: "student" as const,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function log(emoji: string, msg: string) {
  console.log(`  ${emoji}  ${msg}`);
}

/** Clear any stale 2FA data so demo/seed accounts always work without TOTP */
async function clear2FA(userId: string, name: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { twoFactorEnabled: true },
  });
  if (user?.twoFactorEnabled) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        twoFactorBackupCodes: null,
      },
    });
    await prisma.twoFactor.deleteMany({ where: { userId } }).catch(() => {});
    log("🔓", `2FA cleared for ${name}`);
  }
}

// ─── Core seeder ─────────────────────────────────────────────────────────────
async function seedUser(seed: (typeof SEEDS)[number]) {
  const email = seed.email.trim().toLowerCase();

  // 1. Check if user already exists
  const existing = await prisma.user.findUnique({
    where: { email },
    include: {
      studentProfile: true,
      teacherProfile: true,
      adminProfile: true,
    },
  });

  let userId: string;

  if (existing) {
    log("⏭", `${seed.name} already exists (${email}) — updating if needed`);
    userId = existing.id;

    // Ensure role is correct
    if (existing.role !== seed.role) {
      await prisma.user.update({
        where: { id: userId },
        data: { role: seed.role },
      });
      log("✏️", `Role updated → ${seed.role}`);
    }

    // Ensure email is marked verified
    if (!existing.emailVerified) {
      await prisma.user.update({
        where: { id: userId },
        data: { emailVerified: true },
      });
      log("📧", `Email marked as verified`);
    }
  } else {
    // 2. Register via BetterAuth (hashes password correctly)
    log("🔄", `Creating ${seed.name} via BetterAuth...`);

    const signUpResult = await auth.api.signUpEmail({
      body: {
        name: seed.name,
        email,
        password: seed.password,
      },
    });

    userId = signUpResult.user.id;
    log("✅", `${seed.name} registered → ${email}`);

    // Update to correct role + mark email verified
    await prisma.user.update({
      where: { id: userId },
      data: {
        role: seed.role,
        emailVerified: true,       // skip email verification for seed accounts
        needPasswordChange: false,
      },
    });
  }

  // 3. Always clear 2FA for seed accounts (prevents lockout)
  await clear2FA(userId, seed.name);

  // 4. Ensure the correct profile record exists
  if (seed.profile === "admin") {
    const exists = await prisma.adminProfile.findUnique({ where: { userId } });
    if (!exists) {
      await prisma.adminProfile.create({
        data: { userId, isSuperAdmin: true },
      });
      log("🛡️", `AdminProfile created`);
    } else {
      // Ensure super admin flag is set
      if (!exists.isSuperAdmin) {
        await prisma.adminProfile.update({
          where: { userId },
          data: { isSuperAdmin: true },
        });
      }
      log("🛡️", `AdminProfile already exists`);
    }
  } else if (seed.profile === "teacher") {
    const exists = await prisma.teacherProfile.findUnique({ where: { userId } });
    if (!exists) {
      await prisma.teacherProfile.create({ data: { userId } });
      log("👩‍🏫", `TeacherProfile created`);
    } else {
      log("👩‍🏫", `TeacherProfile already exists`);
    }
  } else if (seed.profile === "student") {
    const exists = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!exists) {
      await prisma.studentProfile.create({ data: { userId } });
      log("🎓", `StudentProfile created`);
    } else {
      log("🎓", `StudentProfile already exists`);
    }
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("\n🌱  Nexora — Database Seeding\n");
  console.log("═".repeat(52));

  for (const seed of SEEDS) {
    console.log(`\n📌  ${seed.name.toUpperCase()}  (${seed.email})`);
    console.log("─".repeat(52));
    try {
      await seedUser(seed);
    } catch (err: any) {
      // Handle "User already exists" from BetterAuth gracefully
      if (err?.message?.includes("already exists") || err?.status === 422) {
        log("⏩", `BetterAuth: user already registered — skipping sign-up`);
      } else {
        console.error(`  ❌  Failed for ${seed.email}:`, err?.message ?? err);
      }
    }
  }

  console.log("\n" + "═".repeat(52));
  console.log("✅  Seeding complete!\n");
  console.log("  Login credentials:");
  console.log("  ┌─────────────────────────────────────────────────┐");
  SEEDS.forEach((s) => {
    const roleLabel = s.role.padEnd(7);
    console.log(`  │  ${roleLabel}  ${s.email.padEnd(26)}  ${s.password}  │`);
  });
  console.log("  └─────────────────────────────────────────────────┘\n");
}

main()
  .catch((e) => {
    console.error("\n❌  Fatal seeding error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
